import { NextRequest, NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || ''

  if (query.length < 2) {
    return NextResponse.json([])
  }

  await connectToDatabase()

  const products = await Product.find(
    {
      isPublished: true,
      name: { $regex: escapeRegex(query), $options: 'i' },
    },
    {
      name: 1,
      slug: 1,
      images: 1,
      brand: 1,
      price: 1,
    }
  )
    .sort({ numSales: 'desc' })
    .limit(6)
    .lean()

  return NextResponse.json(
    products.map((product) => ({
      name: product.name,
      slug: product.slug,
      image: product.images?.[0],
      brand: product.brand,
      price: product.price,
    }))
  )
}
