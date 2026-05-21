import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import FlashSale from "@/components/shared/home/flash-sale";
import { HomeCard } from "@/components/shared/home/home-card";
import { HomeCarousel } from "@/components/shared/home/home-carousel";
import ProductSlider from "@/components/shared/product/product-slider";
import {
  getAllCategories,
  getProductsByTag,
  getProductsForCard,
} from "@/lib/actions/product.actions";
import data from "@/lib/data";
import { toSlug } from "@/lib/utils";

export default async function HomePage() {
  const fillProducts = <T,>(items: T[], minimumCount: number) => {
    if (items.length === 0) return items;

    return Array.from(
      { length: Math.max(items.length, minimumCount) },
      (_, index) => items[index % items.length],
    );
  };

  const categories = (await getAllCategories()).slice(0, 4);
  const newArrivals = await getProductsForCard({
    tag: "new-arrival",
    limit: 4,
  });
  const featureds = await getProductsForCard({
    tag: "featured",
    limit: 4,
  });
  const bestSellers = await getProductsForCard({
    tag: "best-seller",
    limit: 4,
  });
  const cards = [
    {
      title: "Categories to explore",
      link: {
        text: "See More",
        href: "/search",
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: "Explore New Arrivals",
      items: newArrivals,
      link: {
        text: "View All",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "Discover Best Sellers",
      items: bestSellers,
      link: {
        text: "View All",
        href: "/search?tag=best-seller",
      },
    },
    {
      title: "Featured Products",
      items: featureds,
      link: {
        text: "Shop Now",
        href: "/search?tag=featured",
      },
    },
  ];

  const todaysDeals = await getProductsByTag({ tag: "todays-deal" });
  const bestSellingProducts = await getProductsByTag({ tag: "best-seller" });

  return (
    <>
      <HomeCarousel items={data.carousels} />
      <div className="md:p-4 md:space-y-4 bg-border">
        <HomeCard cards={cards} />
        <FlashSale products={fillProducts(todaysDeals, 6)} />

        <ProductSlider
          title="Best Selling Products"
          subtitle="Top-rated picks arranged to keep the carousel full while your catalog grows."
          products={bestSellingProducts}
          hideDetails
          minimumCount={18}
        />
      </div>
      <div className="p-4 bg-background">
        <BrowsingHistoryList />
      </div>
    </>
  );
}
