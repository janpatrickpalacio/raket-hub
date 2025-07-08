import { Database } from './types';

type Services = Database['public']['Tables']['services']['Row'];

type RaketeroInfo = Database['public']['Tables']['users']['Row'];

export interface ServiceWithRaketero extends Services {
  raketero: RaketeroInfo;
}
