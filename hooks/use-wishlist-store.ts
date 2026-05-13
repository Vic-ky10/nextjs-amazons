"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type WishlistItem = {
  _id: string
  name: string
  price: number
  image: string
  slug: string
}

type WishlistStore = {
  items: WishlistItem[]

  addItem: (product: WishlistItem) => void

  removeItem: (id: string) => void

  isInWishlist: (id: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const exists = get().items.find(
          (item) => item._id === product._id
        )

        if (exists) return

        set({
          items: [...get().items, product],
        })
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(
            (item) => item._id !== id
          ),
        })
      },

      isInWishlist: (id) => {
        return get().items.some(
          (item) => item._id === id
        )
      },
    }),

    {
      name: "wishlist-storage",
    }
  )
)
