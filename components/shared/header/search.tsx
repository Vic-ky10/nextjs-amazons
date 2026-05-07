'use client'

import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
const categories = ['T-Shirts', 'Jeans', 'Wrist Watches', 'Shoes']
export default function Search() {
  return (
    <form
      action='/search'
      method='GET'
      className='flex h-11 items-stretch rounded-md shadow-sm'
    >
      <Select name='category'>
        <SelectTrigger className='h-full w-[112px] rounded-l-md rounded-r-none border-r border-gray-300 bg-gray-100 text-black dark:border-gray-200'>
          <SelectValue placeholder='All' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className='h-full flex-1 rounded-none border-x-0 bg-white px-4 text-base text-black dark:border-gray-200'
        placeholder='Search products, brands, categories'
        name='q'
        type='search'
      />
      <button
        type='submit'
        className='flex h-full items-center gap-2 rounded-e-md bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary/90'
      >
        <SearchIcon className='w-6 h-6' />
        <span className='hidden lg:inline'>Search</span>
      </button>
    </form>
  )
}
