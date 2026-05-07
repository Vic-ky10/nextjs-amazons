import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
import { notFound } from 'next/navigation'

const pages = {
  'customer-service': {
    title: 'Customer Service',
    body: [
      'We are here to help with orders, delivery questions, returns, and product information.',
      'Use the cart and checkout pages to review your items before placing an order.',
    ],
  },
  'about-us': {
    title: `About ${APP_NAME}`,
    body: [
      `${APP_NAME} is a demo shopping experience built with Next.js, MongoDB, cart state, browsing history, and product discovery.`,
      'The app focuses on the common shopping flow: browse products, view details, add to cart, checkout, and manage profile basics.',
    ],
  },
  help: {
    title: 'Help',
    body: [
      'Search for products from the header, open a product page, choose a variant, and add it to your cart.',
      'From the cart you can update quantities, remove items, and continue to checkout.',
    ],
  },
  'conditions-of-use': {
    title: 'Conditions of Use',
    body: [
      'This project is a learning/demo application. Product, account, and checkout screens are for development practice.',
      'Do not enter real payment information into this demo project.',
    ],
  },
  'privacy-policy': {
    title: 'Privacy Notice',
    body: [
      'This demo stores cart and browsing history locally in the browser for the shopping experience.',
      'A production app should add authentication, secure order storage, and a full privacy policy.',
    ],
  },
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const page = pages[slug as keyof typeof pages]

  return {
    title: page?.title || 'Page not found',
  }
}

export default async function InfoPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const page = pages[slug as keyof typeof pages]

  if (!page) notFound()

  return (
    <Card className='mx-auto w-full max-w-3xl rounded-none'>
      <CardHeader>
        <CardTitle className='text-2xl'>{page.title}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 text-base leading-7'>
        {page.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </CardContent>
    </Card>
  )
}
