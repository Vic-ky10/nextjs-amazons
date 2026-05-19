'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Eye, X } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn, formatNumber, generateId, round2 } from '@/lib/utils'
import type { IProduct } from '@/lib/db/models/product.model'

import AddToCart from './add-to-cart'
import ProductPrice from './product-price'
import Rating from './rating'

export default function ProductQuickView({ product }: { product: IProduct }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const primaryImage = product.images[0]
  const discount =
    product.listPrice > product.price
      ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
      : 0

  return (
    <>
      <Button
        type='button'
        variant='secondary'
        size='sm'
        className='h-8 gap-1 bg-white/95 px-3 shadow-md hover:bg-white'
        onClick={() => setOpen(true)}
      >
        <Eye className='size-4' />
        Quick View
      </Button>

      {open && (
        <div
          className='fixed inset-0 z-50 flex items-end bg-black/55 p-0 sm:items-center sm:p-6'
          role='dialog'
          aria-modal='true'
          aria-label={`${product.name} quick view`}
          onMouseDown={() => setOpen(false)}
        >
          <div
            className='relative grid max-h-[92vh] w-full overflow-y-auto rounded-t-lg bg-background shadow-2xl sm:mx-auto sm:max-w-4xl sm:grid-cols-[0.9fr_1.1fr] sm:rounded-lg'
            onMouseDown={(event) => event.stopPropagation()}
          >
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='absolute right-3 top-3 z-20 bg-background/80'
              onClick={() => setOpen(false)}
              aria-label='Close quick view'
            >
              <X className='size-5' />
            </Button>

            <div className='relative min-h-[320px] bg-muted sm:min-h-[520px]'>
              {discount > 0 && (
                <span className='absolute left-4 top-4 z-10 rounded-sm bg-pink-600 px-2.5 py-1 text-sm font-bold text-white'>
                  {discount}% off
                </span>
              )}
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes='(min-width: 640px) 40vw, 100vw'
                className='object-contain p-8'
              />
            </div>

            <div className='flex flex-col gap-4 p-5 sm:p-7'>
              <div>
                <p className='text-sm font-semibold uppercase text-muted-foreground'>
                  {product.brand}
                </p>
                <h2 className='mt-2 text-2xl font-bold leading-tight'>
                  {product.name}
                </h2>
              </div>

              <div className='flex flex-wrap items-center gap-2 text-sm'>
                <Rating rating={product.avgRating} />
                <span className='text-muted-foreground'>
                  {formatNumber(product.numReviews)} reviews
                </span>
              </div>

              <ProductPrice
                isDeal={product.tags.includes('todays-deal')}
                price={product.price}
                listPrice={product.listPrice}
              />

              <div className='grid grid-cols-2 gap-3 text-sm'>
                <div className='rounded-md border p-3'>
                  <p className='text-muted-foreground'>Stock</p>
                  <p className='font-semibold'>
                    {product.countInStock > 0
                      ? `${product.countInStock} available`
                      : 'Out of stock'}
                  </p>
                </div>
                <div className='rounded-md border p-3'>
                  <p className='text-muted-foreground'>Category</p>
                  <p className='font-semibold'>{product.category}</p>
                </div>
              </div>

              <p className='line-clamp-3 text-sm leading-6 text-muted-foreground'>
                {product.description}
              </p>

              <div className='mt-auto space-y-3'>
                <AddToCart
                  item={{
                    clientId: generateId(),
                    product: product._id.toString(),
                    size: product.sizes[0],
                    color: product.colors[0],
                    countInStock: product.countInStock,
                    name: product.name,
                    slug: product.slug,
                    category: product.category,
                    price: round2(product.price),
                    quantity: 1,
                    image: primaryImage,
                  }}
                />
                <Link
                  href={`/product/${product.slug}`}
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                  onClick={() => setOpen(false)}
                >
                  View full details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
