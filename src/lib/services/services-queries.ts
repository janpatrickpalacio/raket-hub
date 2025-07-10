import { createClient } from '../supabase/server';
import { ServiceWithRaketero } from '../supabase/custom-types';
import { PostgrestError } from '@supabase/supabase-js';

export interface SearchParams {
  q?: string;
  category?: string;
  subcategory?: string;
  province?: string;
  city?: string;
  min?: string;
  max?: string;
  levels?: string;
  duration?: string;
}

interface ServiceQueriesReturn {
  services: ServiceWithRaketero[] | null;
  servicesCount: number | null;
  servicesError: PostgrestError | null;
  servicesCountError: PostgrestError | null;
}

const MAX_DISPLAY_PER_PAGE = 12;

export default async function getServiceQueries(searchParams: Promise<SearchParams>): Promise<ServiceQueriesReturn> {
  const allSearchParams = await searchParams;
  const supabase = await createClient();

  const selectString = `
      *,
      raketero:users${allSearchParams.levels || allSearchParams.province || allSearchParams.city ? '!inner' : ''}(id, first_name, last_name, avatar_url, username, average_rating, total_reviews, level, city_id)
    `;

  let servicesQuery = supabase
    .from('services')
    .select(selectString)
    .eq('status', 'approved')
    .range(0, MAX_DISPLAY_PER_PAGE);

  let servicesCountQuery = supabase.from('services').select(selectString, { count: 'exact' }).eq('status', 'approved');

  for (const [key, value] of Object.entries(allSearchParams)) {
    switch (key) {
      case 'category': {
        const { data: category } = await supabase.from('categories').select('id').eq('slug', value).single();

        const { data: subcategories } = await supabase
          .from('subcategories')
          .select('id')
          .eq('category_id', category?.id ?? -1);

        servicesQuery = servicesQuery.in('subcategory_id', subcategories?.map(subcategory => subcategory.id) || []);
        servicesCountQuery = servicesCountQuery.in(
          'subcategory_id',
          subcategories?.map(subcategory => subcategory.id) || []
        );
        break;
      }
      case 'subcategory': {
        const { data: subcategory } = await supabase.from('subcategories').select('id').eq('slug', value).single();
        servicesQuery = servicesQuery.eq('subcategory_id', subcategory?.id ?? -1);
        servicesCountQuery = servicesCountQuery.eq('subcategory_id', subcategory?.id ?? -1);
        break;
      }
      case 'min': {
        servicesQuery = servicesQuery.gte('price', Number(value));
        servicesCountQuery = servicesCountQuery.gte('price', Number(value));
        break;
      }
      case 'max': {
        servicesQuery = servicesQuery.lte('price', Number(value));
        servicesCountQuery = servicesCountQuery.lte('price', Number(value));
        break;
      }
      case 'levels':
        servicesQuery = servicesQuery.in('raketero.level', value.split(','));
        servicesCountQuery = servicesCountQuery.in('raketero.level', value.split(','));
        break;
      case 'days':
        if (Number(value) > 0) {
          servicesQuery = servicesQuery.lte('delivery_days', value);
          servicesCountQuery = servicesCountQuery.lte('delivery_days', value);
        }
        break;
      default:
        continue;
    }
  }

  if (allSearchParams.province) {
    if (allSearchParams.city) {
      const { data: city } = await supabase.from('cities').select('id').eq('slug', allSearchParams.city).single();

      servicesQuery = servicesQuery.eq('raketero.city_id', city?.id ?? -1);
      servicesCountQuery = servicesCountQuery.eq('raketero.city_id', city?.id ?? -1);
    } else {
      const { data: province } = await supabase
        .from('provinces')
        .select('id')
        .eq('slug', allSearchParams.province)
        .single();

      const { data: cities } = await supabase
        .from('cities')
        .select('id')
        .eq('province_id', province?.id ?? -1);

      servicesQuery = servicesQuery.in('raketero.city_id', cities?.map(city => city.id) || []);
      servicesCountQuery = servicesCountQuery.in('raketero.city_id', cities?.map(city => city.id) || []);
    }
  }

  if (allSearchParams.q) {
    servicesQuery = servicesQuery.textSearch('fts', allSearchParams.q, { type: 'websearch' });
    servicesCountQuery = servicesCountQuery.textSearch('fts', allSearchParams.q, { type: 'websearch' });
  }

  const { data: services, error: servicesError } = await servicesQuery;
  const { count: servicesCount, error: servicesCountError } = await servicesCountQuery;

  return {
    services: services as ServiceWithRaketero[] | null,
    servicesCount,
    servicesError,
    servicesCountError,
  };
}
