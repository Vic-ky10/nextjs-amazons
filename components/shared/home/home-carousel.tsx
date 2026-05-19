'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function HomeCarousel({
  items,
}: {
  items: {
    image: string
    url: string
    title: string
    buttonCaption: string
  }[]
}) {
  const [autoplay] = React.useState(() =>
    Autoplay({ delay: 4500, stopOnInteraction: true })
  )
  const [api, setApi] = React.useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [slideCount, setSlideCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    const updateSelectedSlide = () => {
      setSelectedIndex(api.selectedScrollSnap())
      setSlideCount(api.scrollSnapList().length)
    }

    updateSelectedSlide()
    api.on('select', updateSelectedSlide)
    api.on('reInit', updateSelectedSlide)

    return () => {
      api.off('select', updateSelectedSlide)
      api.off('reInit', updateSelectedSlide)
    }
  }, [api])

  return (
    <section className='bg-background'>
      <Carousel
        dir='ltr'
        opts={{ loop: true }}
        plugins={[autoplay]}
        setApi={setApi}
        className='w-full'
        onMouseEnter={() => autoplay.stop()}
        onMouseLeave={() => autoplay.reset()}
      >
        <CarouselContent className='ml-0'>
          {items.map((item, index) => (
            <CarouselItem key={item.title} className='pl-0'>
              <div className='relative min-h-[320px] overflow-hidden md:min-h-[430px] lg:min-h-[500px]'>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className='object-cover'
                  sizes='100vw'
                  priority={index === 0}
                />
                <div className='absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent' />
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full max-w-7xl px-5 sm:px-8 lg:px-12'>
                    <div className='max-w-xl text-white'>
                      <p className='mb-3 w-fit rounded-sm bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 ring-1 ring-white/25'>
                        Featured collection
                      </p>
                      <h2 className='text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl'>
                        {item.title}
                      </h2>
                      <p className='mt-4 max-w-md text-sm leading-6 text-white/85 sm:text-base'>
                        Fresh picks, sharp prices, and fast routes to the styles
                        your customers are already looking for.
                      </p>
                      <Link
                        href={item.url}
                        className={cn(
                          buttonVariants({ size: 'lg' }),
                          'mt-6 h-10 w-fit gap-2 px-4'
                        )}
                      >
                        {item.buttonCaption}
                        <ArrowRight className='size-4' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant='secondary'
          className='left-3 hidden bg-white/90 text-foreground shadow-md hover:bg-white md:inline-flex lg:left-8'
        />
        <CarouselNext
          variant='secondary'
          className='right-3 hidden bg-white/90 text-foreground shadow-md hover:bg-white md:inline-flex lg:right-8'
        />
        {slideCount > 1 && (
          <div className='absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2'>
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={index}
                type='button'
                aria-label={`Go to slide ${index + 1}`}
                aria-current={selectedIndex === index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'h-2.5 rounded-full bg-white/60 transition-all hover:bg-white',
                  selectedIndex === index ? 'w-8 bg-white' : 'w-2.5'
                )}
              />
            ))}
          </div>
        )}
      </Carousel>
    </section>
  )
}
