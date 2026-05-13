import ProductCard from '@/components/shared/product/product-card'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAllCategories, getAllProducts } from '@/lib/actions/product.actions'
import { cn } from '@/lib/utils'
import Link from 'next/link'


const sortOptions = [
  { value: 'best-selling', name: 'Best selling' },
  { value: 'newest', name: 'Newest' },
  { value: 'lowest', name: 'Price: low to high' },
  { value: 'highest', name: 'Price: high to low' },
]

function buildHref(
  params: {
    q?: string
    category?: string
    tag?: string
    sort?: string
    page?: string
  },
  updates: Record<string, string | undefined>
) {
  const next = new URLSearchParams()
  const merged = { ...params, ...updates }

  Object.entries(merged).forEach(([key, value]) => {
    if (value && value !== 'all') next.set(key, value)
  })

  const query = next.toString()
  return query ? `/search?${query}` : '/search'
}

export const metadata = {
  title: 'Search',
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string
    category?: string
    tag?: string
    sort?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const { q, category, tag, sort = 'best-selling' } = searchParams
  const page = Number(searchParams.page || '1')
  const categories = await getAllCategories()
  const products = await getAllProducts({
    query: q,
    category,
    tag,
    sort,
    page,
  })

  const activeParams = { q, category, tag, sort }

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-2xl font-bold'>Search products</h1>
        <p className='text-muted-foreground'>
          {products.totalProducts} result{products.totalProducts === 1 ? '' : 's'}
          {q ? ` for "${q}"` : ''}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-5'>
        <Card className='h-fit rounded-none lg:col-span-1'>
          <CardContent className='space-y-5 pt-2'>
            <div>
              <div className='mb-2 font-semibold'>Category</div>
              <div className='flex flex-wrap gap-2 lg:flex-col'>
                <Link
                  href={buildHref(activeParams, { category: undefined })}
                  className={cn(
                    buttonVariants({
                      variant: !category ? 'default' : 'outline',
                      size: 'sm',
                    }),
                    'justify-start'
                  )}
                >
                  All
                </Link>
                {categories.map((item) => (
                  <Link
                    key={item}
                    href={buildHref(activeParams, { category: item })}
                    className={cn(
                      buttonVariants({
                        variant: category === item ? 'default' : 'outline',
                        size: 'sm',
                      }),
                      'justify-start'
                    )}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold'>Sort</div>
              <div className='flex flex-wrap gap-2 lg:flex-col'>
                {sortOptions.map((option) => (
                  <Link
                    key={option.value}
                    href={buildHref(activeParams, { sort: option.value })}
                    className={cn(
                      buttonVariants({
                        variant: sort === option.value ? 'default' : 'outline',
                        size: 'sm',
                      }),
                      'justify-start'
                    )}
                  >
                    {option.name}
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='lg:col-span-4'>
          {products.data.length === 0 ? (
            <Card className='rounded-none'>
              <CardContent className='py-8 text-center'>
                No products found. Try a different search or category.
              </CardContent>
            </Card>
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              {products.data.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}

          {products.totalPages > 1 && (
            <div className='mt-6 flex justify-center gap-2'>
              {Array.from({ length: products.totalPages }).map((_, i) => {
                const pageNumber = `${i + 1}`

                return (
                  <Link
                    key={pageNumber}
                    href={buildHref(activeParams, { page: pageNumber })}
                    className={buttonVariants({
                      variant: page === i + 1 ? 'default' : 'outline',
                      size: 'sm',
                    })}
                  >
                    {pageNumber}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
