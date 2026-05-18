'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Flame, Timer } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import type { IProduct } from '@/lib/db/models/product.model'
import { cn, formatCurrency } from '@/lib/utils'

function getTodaysSaleEnd() {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return end
}

function formatTimeLeft(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, '0'))
    .join(':')
}

export default function FlashSale({ products }: { products: IProduct[] }) {
  const saleEnd = useMemo(() => getTodaysSaleEnd(), [])
  const [timeLeft, setTimeLeft] = useState(() =>
    formatTimeLeft(saleEnd.getTime() - Date.now())
  )

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeLeft(formatTimeLeft(saleEnd.getTime() - Date.now()))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [saleEnd])

  if (products.length === 0) return null

  return (
    <section className='bg-background'>
      <div className='flex flex-col gap-4 p-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='flex items-center gap-2 text-xl font-bold'>
              <Flame className='h-6 w-6 text-pink-600' />
              Flash Sale
            </div>
            <p className='text-sm text-muted-foreground'>
              Limited-time deals picked from today&apos;s offers
            </p>
          </div>
          <div className='flex items-center gap-2 rounded-md border bg-muted px-3 py-2 font-mono text-sm font-semibold'>
            <Timer className='h-4 w-4 text-pink-600' />
            {timeLeft}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6'>
          {products.slice(0, 6).map((product) => {
            const discount =
              product.listPrice > product.price
                ? Math.round(
                    ((product.listPrice - product.price) / product.listPrice) *
                      100
                  )
                : 0
            const soldPercent = Math.min(
              96,
              Math.max(28, product.numSales % 100)
            )

            return (
              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className='group rounded-md border bg-card p-3 transition-colors hover:border-pink-500'
              >
                <div className='relative mb-3 aspect-square overflow-hidden rounded bg-background'>
                  {discount > 0 && (
                    <span className='absolute left-2 top-2 z-10 rounded-sm bg-pink-600 px-2 py-1 text-xs font-bold text-white'>
                      {discount}% off
                    </span>
                  )}
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes='(min-width: 1280px) 16vw, (min-width: 768px) 25vw, 50vw'
                    className='object-contain transition-transform group-hover:scale-105'
                  />
                </div>
                <div className='line-clamp-2 min-h-10 text-sm font-medium'>
                  {product.name}
                </div>
                <div className='mt-2 flex items-end gap-2'>
                  <span className='font-bold text-pink-600'>
                    {formatCurrency(product.price)}
                  </span>
                  {product.listPrice > product.price && (
                    <span className='text-xs text-muted-foreground line-through'>
                      {formatCurrency(product.listPrice)}
                    </span>
                  )}
                </div>
                <div className='mt-3 h-2 overflow-hidden rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-pink-600'
                    style={{ width: `${soldPercent}%` }}
                  />
                </div>
                <div className='mt-1 text-xs text-muted-foreground'>
                  {soldPercent}% claimed
                </div>
              </Link>
            )
          })}
        </div>

        <Link
          href='/search?tag=todays-deal'
          className={cn(buttonVariants({ variant: 'outline' }), 'w-fit')}
        >
          Shop all flash deals
        </Link>
      </div>
    </section>
  )
}
