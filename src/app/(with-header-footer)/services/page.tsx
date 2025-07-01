import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ServiceCard from '@/features/home/components/service-card';

export default function ServicesPage() {
  return (
    <div className='bg-neutral-50'>
      <main className='relative container mx-auto grid min-h-[80dvh] grid-cols-5 gap-8 py-10'>
        <aside className='sticky top-0 left-0 flex w-full flex-col gap-4'>
          <h2 className='text-2xl font-bold'>Filters</h2>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-3'>
              <Label>Category</Label>
              <Select>
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  <SelectItem value='category-1'>Category 1</SelectItem>
                  <SelectItem value='category-2'>Category 2</SelectItem>
                  <SelectItem value='category-3'>Category 3</SelectItem>
                  <SelectItem value='category-4'>Category 4</SelectItem>
                  <SelectItem value='category-5'>Category 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Location</Label>
              <Input placeholder='Enter a location' className='bg-white' />
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Price Range (PHP)</Label>
              <div className='flex items-center gap-2'>
                <Input placeholder='Min' className='bg-white' />
                <span>-</span>
                <Input placeholder='Max' className='bg-white' />
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Raketero Level</Label>
              <div className='flex items-center gap-2 text-black/80'>
                <Checkbox className='bg-white' id='top-rated' />
                <Label htmlFor='top-rated'>Top Rated</Label>
              </div>
              <div className='flex items-center gap-2 text-black/80'>
                <Checkbox className='bg-white' id='level-2' />
                <Label htmlFor='level-2'>Level 2</Label>
              </div>
              <div className='flex items-center gap-2 text-black/80'>
                <Checkbox className='bg-white' id='level-1' />
                <Label htmlFor='level-1'>Level 1</Label>
              </div>
              <div className='flex items-center gap-2 text-black/80'>
                <Checkbox className='bg-white' id='new-raketero' />
                <Label htmlFor='new-raketero'>New Raketero</Label>
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <Label>Delivery Time</Label>
              <RadioGroup defaultValue='any'>
                <div className='flex items-center gap-2 text-black/80'>
                  <RadioGroupItem value='express-24h' id='express-24h' className='bg-white' />
                  <Label htmlFor='express-24h'>Express 24H</Label>
                </div>
                <div className='flex items-center gap-2 text-black/80'>
                  <RadioGroupItem value='up-to-3-days' id='up-to-3-days' className='bg-white' />
                  <Label htmlFor='up-to-3-days'>Up to 3 days</Label>
                </div>
                <div className='flex items-center gap-2 text-black/80'>
                  <RadioGroupItem value='up-to-7-days' id='up-to-7-days' className='bg-white' />
                  <Label htmlFor='up-to-7-days'>Up to 7 days</Label>
                </div>
                <div className='flex items-center gap-2 text-black/80'>
                  <RadioGroupItem value='any' id='any' className='bg-white' />
                  <Label htmlFor='any'>Any</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </aside>
        <section className='col-span-4 flex flex-col gap-2'>
          <h1 className='text-3xl font-bold'>Local Services in Angeles</h1>
          <p className='text-black/50'>Showing 1-12 of 86 results</p>
          <div className='mt-4 grid grid-cols-3 gap-6'>
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
            <ServiceCard title='Condo Cleaning for 2-Bedrooms' price={100} />
          </div>
          <Pagination className='mt-8'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='#' />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#'>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </main>
    </div>
  );
}
