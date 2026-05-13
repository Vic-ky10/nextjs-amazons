"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import useIsMounted from "@/hooks/use-is-mounted";

type WishListButtonProps = {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    slug: string ;
  };
};

const WishlistButton = ({ product }: WishListButtonProps) => {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isMounted = useIsMounted();

  const exists = isMounted && isInWishlist(product._id);

  const handleWishList = () => {
    if (exists) {
      removeItem(product._id);
    } else {
      addItem(product);
    }
  };
  return (
    <button
      onClick={handleWishList}
      className="p-2 rounded-full bg-card text-card-foreground shadow-md ring-1 ring-border hover:scale-110 transition"
    >
      <Heart
        className={`w-5 h-5 transition ${exists ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
      />
    </button>
  );
};

export default WishlistButton;
