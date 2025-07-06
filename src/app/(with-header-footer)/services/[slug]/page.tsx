import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { createClient } from '@/lib/supabase/server';
import { PublicRoutes } from '@/routes';

interface Props {
  params: {
    slug: string;
  };
}

export default async function ServiceViewPage({ params }: Props) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select(
      `
      *,
      raketero:users(id, first_name, last_name, avatar_url, username, average_rating, total_reviews)
    `
    )
    .eq('slug', slug)
    .single();

  const { data: subcategory, error: subcategoryError } = await supabase
    .from('subcategories')
    .select('category_id, name, slug')
    .eq('id', service?.subcategory_id || -1)
    .single();

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('name, slug')
    .eq('id', subcategory?.category_id || -1)
    .single();

  console.log(service, subcategory, category);

  if (serviceError || subcategoryError || categoryError) {
    throw new Error(serviceError?.message || subcategoryError?.message || categoryError?.message);
  }

  return (
    <main className='container mx-auto my-12'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`${PublicRoutes.SERVICES}?category=${category.slug}`}>{category.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`${PublicRoutes.SERVICES}?category=${category.slug}&subcategory=${subcategory.slug}`}>
              {subcategory.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </main>
  );
}
