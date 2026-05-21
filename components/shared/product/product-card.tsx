import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IProduct } from "@/lib/db/models/product.model";

import Rating from "./rating";
import { cn, formatNumber, generateId, round2 } from "@/lib/utils";
import ProductPrice from "./product-price";
import ImageHover from "./image-hover";
import AddToCart from "./add-to-cart";
import WishlistButton from "./wishlist-button";
import ProductQuickView from "./product-quick-view";

type ProductCardProps = {
  product: IProduct;
  hideDetails?: boolean;
  hideBorder?: boolean;
  hideAddToCart?: boolean;
};

const ProductImage = ({ product }: { product: IProduct }) => {
  const primaryImage = product.images[0];
  const hoverImage = product.images[1];
  const discount =
    product.listPrice > product.price
      ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
      : 0;

  return (
    <div className="group relative overflow-hidden rounded-md bg-muted/40">
      <div className="absolute left-2 top-2 z-20 flex flex-col gap-1">
        {discount > 0 && (
          <span className="rounded-sm bg-pink-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
            {discount}% off
          </span>
        )}
        {product.tags.includes("new-arrival") && (
          <span className="rounded-sm bg-emerald-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
            New
          </span>
        )}
      </div>
      <div className="absolute top-2 right-2 z-20">
        <WishlistButton
          product={{
            _id: product._id.toString(),
            name: product.name,
            price: product.price,
            image: primaryImage,
            slug: product.slug,
          }}
        />
      </div>

      <Link href={`/product/${product.slug}`}>
        <div className="relative h-52">
          {hoverImage ? (
            <ImageHover
              src={primaryImage}
              hoverSrc={hoverImage}
              alt={product.name}
            />
          ) : (
            <div className="relative h-52">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="80vw"
                className="object-contain"
              />
            </div>
          )}
        </div>
      </Link>
      <div className="absolute inset-x-3 bottom-3 z-20 flex justify-center transition-all sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
        <ProductQuickView product={product} />
      </div>
    </div>
  );
};

const ProductDetails = ({ product }: { product: IProduct }) => (
  <div className="flex-1 space-y-2">
    <div className="flex items-center justify-between gap-2">
      <p className="truncate text-sm font-bold text-muted-foreground">
        {product.brand}
      </p>
      <span
        className={cn(
          "shrink-0 rounded-sm px-2 py-0.5 text-xs font-semibold",
          product.countInStock > 0
            ? "bg-emerald-50 text-emerald-700"
            : "bg-muted text-muted-foreground"
        )}
      >
        {product.countInStock > 0 ? "In stock" : "Sold out"}
      </span>
    </div>
    <Link
      href={`/product/${product.slug}`}
      className="block min-h-10 overflow-hidden text-ellipsis text-left font-medium transition-colors hover:text-pink-600"
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
      }}
    >
      {product.name}
    </Link>
    <div className="flex items-center gap-2">
      <Rating rating={product.avgRating} />
      <span className="text-sm text-muted-foreground">
        ({formatNumber(product.numReviews)})
      </span>
    </div>

    <ProductPrice
      isDeal={product.tags.includes("todays-deal")}
      price={product.price}
      listPrice={product.listPrice}
      forListing
    />
  </div>
);

const AddButton = ({ product }: { product: IProduct }) => (
  <div className="w-full">
    <AddToCart
      minimal
      item={{
        clientId: generateId(),
        product: product._id.toString(),
        size: product.sizes[0],
        color: product.colors[0],
        countInStock: product.countInStock,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: round2(product.price),
        quantity: 1,
        image: product.images[0],
      }}
    />
  </div>
);

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: ProductCardProps) => {
  return hideBorder ? (
    <div className="flex flex-col">
      <ProductImage product={product} />
      {!hideDetails && (
        <>
          <div className="p-3 flex-1">
            <ProductDetails product={product} />
          </div>
          {!hideAddToCart && <AddButton product={product} />}
        </>
      )}
    </div>
  ) : (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="p-3">
        <ProductImage product={product} />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className="p-3 flex-1">
            <ProductDetails product={product} />
          </CardContent>
          <CardFooter className="p-3">
            {!hideAddToCart && <AddButton product={product} />}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ProductCard;
