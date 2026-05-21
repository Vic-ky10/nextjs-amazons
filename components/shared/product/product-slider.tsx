'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import ProductCard from './product-card'
import { IProduct } from '@/lib/db/models/product.model'
import { cn } from '@/lib/utils'

function repeatProducts(products: IProduct[], minimumCount: number) {
  if (products.length === 0) return []

  return Array.from(
    { length: Math.max(products.length, minimumCount) },
    (_, index) => products[index % products.length]
  )
}

export default function ProductSlider({
  title,
  products,
  hideDetails = false,
  subtitle,
  minimumCount = 12,
}: {
  title?: string
  products: IProduct[]
  hideDetails?: boolean
  subtitle?: string
  minimumCount?: number
}) {
  const displayProducts = repeatProducts(products, minimumCount)

  if (displayProducts.length === 0) return null

  return (
    <section className='w-full bg-background p-4'>
      <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-wide text-pink-600'>
            Customer favorites
          </p>
          <h2 className='text-2xl font-bold leading-tight'>{title}</h2>
          {subtitle && (
            <p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-3'>
          {displayProducts.map((product, index) => (
            <CarouselItem
              key={`${product.slug}-${index}`}
              className={cn(
                'basis-1/2 pl-3',
                hideDetails
                  ? 'sm:basis-1/3 md:basis-1/4 xl:basis-1/6'
                  : 'md:basis-1/3 lg:basis-1/5'
              )}
            >
              <ProductCard
                hideDetails={hideDetails}
                hideAddToCart
                hideBorder
                product={product}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-0' />
        <CarouselNext className='right-0' />
      </Carousel>
    </section>
  )
}
