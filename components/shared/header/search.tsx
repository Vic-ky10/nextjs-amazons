'use client'

import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function Search() {
  return (
    <form
      action='/search'
      method='GET'
      className='flex h-11 items-stretch rounded-md shadow-sm'
    >
    
      <Input
        className='h-full flex-1 rounded-e-none border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground'
        placeholder='Search products, brands, categories'
        name='q'
        type='search'
      />
      <button
        type='submit'
        className='flex h-full items-center gap-2 rounded-e-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90'
      >
        <SearchIcon className='w-6 h-6' />
        <span className='hidden lg:inline'>Search</span>
      </button>
    </form>
  )
}
