import { Database } from './types';

type Services = Database['public']['Tables']['services']['Row'];

type RaketeroInfo = Pick<
  Database['public']['Tables']['users']['Row'],
  'id' | 'first_name' | 'last_name' | 'avatar_url' | 'username'
>;

export interface ServiceWithRaketero extends Services {
  raketero: RaketeroInfo;
}
