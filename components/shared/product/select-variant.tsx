import { Button } from '@/components/ui/button'
import { IProduct } from '@/lib/db/models/product.model'
import Link from 'next/link'

export default function SelectVariant({
  product,
  size,
  color,
}: {
  product: IProduct
  color: string
  size: string
}) {
  const colorVariants = product.colorImages ?? []
  const availableColors =
    colorVariants.length > 0
      ? colorVariants.map((variant) => variant.color)
      : product.colors.slice(0, 1)
  const selectedColor = availableColors.includes(color)
    ? color
    : availableColors[0] || ''
  const selectedSize = size || product.sizes[0]

  return (
    <>
      {availableColors.length > 0 && (
        <div className='space-x-2 space-y-2'>
          <div>Color:</div>
          {availableColors.map((x: string) => (
            <Button
              nativeButton={false}
              render={
                <Link
                  replace
                  scroll={false}
                  href={`?${new URLSearchParams({
                    color: x,
                    size: selectedSize,
                  })}`}
                >
                  <div
                    style={{ backgroundColor: x }}
                    className='h-4 w-4 rounded-full border border-muted-foreground'
                  ></div>
                  {x}
                </Link>
              }
              variant='outline'
              className={
                selectedColor === x ? 'border-2 border-primary' : 'border-2'
              }
              key={x}
            />
          ))}
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className='mt-2 space-x-2 space-y-2'>
          <div>Size:</div>
          {product.sizes.map((x: string) => (
            <Button
              nativeButton={false}
              render={
                <Link
                  replace
                  scroll={false}
                  href={`?${new URLSearchParams({
                    color: selectedColor,
                    size: x,
                  })}`}
                >
                  {x}
                </Link>
              }
              variant='outline'
              className={
                selectedSize === x ? 'border-2  border-primary' : 'border-2  '
              }
              key={x}
            />
          ))}
        </div>
      )}
    </>
  )
}
