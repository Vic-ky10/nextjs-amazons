'use client'
import { cn, formatCurrency } from '@/lib/utils'

const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  forListing = true,
  plain = false,
}: {
  price: number
  isDeal?: boolean
  listPrice?: number
  className?: string
  forListing?: boolean
  plain?: boolean
}) => {
  const discountPercent = Math.round(100 - (price / listPrice) * 100)
  const stringValue = price.toFixed(2)
  const [intValue, floatValue] = stringValue.includes('.')
    ? stringValue.split('.')
    : [stringValue, '']
  const formattedIntValue = Number(intValue).toLocaleString('en-IN')
  const decimalValue = floatValue ? `.${floatValue}` : ''

  return plain ? (
    formatCurrency(price)
  ) : listPrice == 0 ? (
    <div className={cn('text-3xl', className)}>
      <span className='text-xs align-super'>&#8377;</span>
      {formattedIntValue}
      <span className='text-xs align-super'>{decimalValue}</span>
    </div>
  ) : isDeal ? (
    <div className='space-y-2'>
      <div className='flex justify-center items-center gap-2'>
        <span className='bg-red-700 rounded-sm p-1 text-white text-sm font-semibold'>
          {discountPercent}% Off
        </span>
        <span className='text-destructive text-xs font-bold'>
          Limited time deal
        </span>
      </div>
      <div
        className={`flex ${
          forListing && 'justify-center'
        } items-center gap-2`}
      >
        <div className={cn('text-3xl', className)}>
          <span className='text-xs align-super'>&#8377;</span>
          {formattedIntValue}
          <span className='text-xs align-super'>{decimalValue}</span>
        </div>
        <div className='text-muted-foreground text-xs py-2'>
          Was:{' '}
          <span className='line-through'>{formatCurrency(listPrice)}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className=''>
      <div className='flex justify-center gap-3'>
        <div className='text-3xl text-destructive'>-{discountPercent}%</div>
        <div className={cn('text-3xl', className)}>
          <span className='text-xs align-super'>&#8377;</span>
          {formattedIntValue}
          <span className='text-xs align-super'>{decimalValue}</span>
        </div>
      </div>
      <div className='text-muted-foreground text-xs py-2'>
        List price:{' '}
        <span className='line-through'>{formatCurrency(listPrice)}</span>
      </div>
    </div>
  )
}

export default ProductPrice
