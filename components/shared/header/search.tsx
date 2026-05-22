'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'

type SearchSuggestion = {
  name: string
  slug: string
  image?: string
  brand?: string
  price: number
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/products/suggestions?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        )

        if (response.ok) {
          setSuggestions(await response.json())
          setIsOpen(true)
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([])
        }
      }
    }, 180)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [query])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!formRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return (
    <form
      ref={formRef}
      action='/search'
      method='GET'
      className='relative flex h-11 items-stretch rounded-md shadow-sm'
      onSubmit={() => setIsOpen(false)}
    >
      <Input
        className='h-full flex-1 rounded-e-none border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground'
        placeholder='Search products, brands, categories'
        name='q'
        type='search'
        value={query}
        autoComplete='off'
        onChange={(event) => {
          const nextQuery = event.target.value
          setQuery(nextQuery)
          if (nextQuery.trim().length < 2) setIsOpen(false)
        }}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true)
        }}
      />
      <button
        type='submit'
        className='flex h-full items-center gap-2 rounded-e-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-400'
      >
        <SearchIcon className='w-6 h-6' />
        <span className='hidden lg:inline'>Search</span>
      </button>
      {isOpen && suggestions.length > 0 && (
        <div className='absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg'>
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion.slug}
              href={`/product/${suggestion.slug}`}
              className='flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted'
              onClick={() => setIsOpen(false)}
            >
              <span className='relative h-10 w-10 shrink-0 overflow-hidden rounded bg-card'>
                {suggestion.image && (
                  <Image
                    src={suggestion.image}
                    alt={suggestion.name}
                    fill
                    sizes='40px'
                    className='object-contain'
                  />
                )}
              </span>
              <span className='flex min-w-0 flex-1 items-start justify-between gap-3'>
                <span className='min-w-0'>
                  <span className='block truncate font-medium'>
                    {suggestion.name}
                  </span>
                  {suggestion.brand && (
                    <span className='block truncate text-xs text-muted-foreground'>
                      {suggestion.brand}
                    </span>
                  )}
                </span>
                <span className='shrink-0 whitespace-nowrap font-semibold text-pink-600 dark:text-pink-400'>
                  {formatCurrency(suggestion.price)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </form>
  )
}
