import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    href: string
  }[]
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
  return (
    <section className='bg-background p-4'>
      <div className='mb-5'>
        <p className='text-sm font-semibold uppercase tracking-wide text-pink-600'>
          Shop smarter
        </p>
        <h2 className='text-2xl font-bold leading-tight'>
          Featured store picks
        </h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Browse popular categories, new arrivals, and hand-picked product groups.
        </p>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {cards.map((card) => (
          <Card key={card.title} className='flex flex-col overflow-hidden'>
            <CardContent className='flex-1 p-4'>
              <h3 className='mb-4 text-lg font-bold'>{card.title}</h3>
              <div className='grid grid-cols-2 gap-3'>
                {card.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='group flex flex-col rounded-md border bg-background p-2 transition-colors hover:border-pink-500'
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      className='mx-auto aspect-square h-auto max-w-full object-scale-down transition-transform group-hover:scale-105'
                      height={120}
                      width={120}
                    />
                    <p className='overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm'>
                      {item.name}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
            {card.link && (
              <CardFooter className='pt-0'>
                <Link
                  href={card.link.href}
                  className='text-sm font-semibold text-pink-600 hover:underline'
                >
                  {card.link.text}
                </Link>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}


