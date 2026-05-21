"use client";

import Image from "next/image";
import Link from "next/link";

import { useWishlistStore } from "@/hooks/use-wishlist-store";
import useIsMounted from "@/hooks/use-is-mounted";
import ProductPrice from "@/components/shared/product/product-price";

const WishlistPage = () => {
  const { items, removeItem } = useWishlistStore();
  const isMounted = useIsMounted();
  const wishlistItems = isMounted ? items : [];

  return (
    <div className="container mx-auto py-10">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Wishlist ❤️</h1>

        <p className="text-muted-foreground mt-2">Saved products for later</p>
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>

          <p className="text-muted-foreground mt-2">Add products you love ❤️</p>
        </div>
      ) : (
        /* Product Grid */
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
        "
        >
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="
                border
                border-border
                bg-card
                text-card-foreground
                rounded-xl
                p-4
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              {/* Product Image */}
              <Link href={`/product/${item.slug}`}>
                <div className="relative h-52 mb-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="space-y-2">
                <h2 className="font-semibold line-clamp-2">{item.name}</h2>

                <p className="text-lg font-bold">
                  <ProductPrice price={item.price} plain />
                </p>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item._id)}
                  className="
                    w-full
                    bg-destructive
                    text-white
                    py-2
                    rounded-lg
                    hover:bg-destructive/90
                    transition
                  "
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
