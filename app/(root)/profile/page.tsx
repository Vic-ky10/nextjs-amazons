'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  defaultDemoProfile,
  saveDemoProfile,
  useDemoProfile,
} from '@/hooks/use-demo-profile'
import Link from 'next/link'
import { FormEvent } from 'react'

export default function ProfilePage() {
  const { profile, setProfile, isConnected } = useDemoProfile()
  const { toast } = useToast()

  const updateProfile = (field: keyof typeof defaultDemoProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveDemoProfile(profile)
    toast(
      'Account connected',
      `${profile.name} is now connected to this app.`,
      'success'
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
      <Card className='rounded-none lg:col-span-2'>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>
            Save your details to connect this account to the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className='grid gap-3 sm:grid-cols-2'>
            <Input
              required
              placeholder='Full name'
              value={profile.name}
              onChange={(event) => updateProfile('name', event.target.value)}
            />
            <Input
              required
              type='email'
              placeholder='Email address'
              value={profile.email}
              onChange={(event) => updateProfile('email', event.target.value)}
            />
            <Input
              type='tel'
              placeholder='Phone number'
              value={profile.phone}
              onChange={(event) => updateProfile('phone', event.target.value)}
            />
            <Input
              placeholder='Default address'
              value={profile.address}
              onChange={(event) => updateProfile('address', event.target.value)}
            />
            <div className='sm:col-span-2'>
              <Button type='submit' className='rounded-full'>
                Save profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle>Account summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm'>
            <div className='rounded-lg border border-green-600 bg-green-50 p-3 text-green-800'>
              {isConnected
                ? 'This account is connected for this app.'
                : 'Save your profile to connect this account.'}
            </div>
            <div>
              <div className='font-medium'>Name</div>
              <div className='text-muted-foreground'>{profile.name}</div>
            </div>
            <div>
              <div className='font-medium'>Email</div>
              <div className='text-muted-foreground'>{profile.email}</div>
            </div>
            <div>
              <div className='font-medium'>Default delivery</div>
              <div className='text-muted-foreground'>
                {profile.address || 'No address saved yet'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-none'>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <Link
              href='/account'
              className={buttonVariants({
                variant: 'outline',
                className: 'justify-start',
              })}
            >
              Account
            </Link>
            <Link
              href='/cart'
              className={buttonVariants({
                variant: 'outline',
                className: 'justify-start',
              })}
            >
              Shopping cart
            </Link>
            <Link
              href='/checkout'
              className={buttonVariants({
                variant: 'outline',
                className: 'justify-start',
              })}
            >
              Checkout
            </Link>
            <Link
              href='/orders'
              className={buttonVariants({
                variant: 'outline',
                className: 'justify-start',
              })}
            >
              Orders
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
