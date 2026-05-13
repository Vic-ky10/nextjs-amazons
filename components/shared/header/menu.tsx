"use client";

import { useDemoProfile } from "@/hooks/use-demo-profile";
import { ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function Menu() {
  const { profile, isConnected } = useDemoProfile();

  return (
    <div className="flex justify-end">
    
      <nav className="flex gap-2 w-full">
        <Link href="/account" className="flex items-center gap-1 header-button">
          <UserIcon className="h-5 w-5" />

          <span className="flex flex-col leading-tight">
            <span className="text-xs text-white/70">
              Hello, {isConnected ? profile.name.split(" ")[0] : "sign in"}
            </span>
            <span className="font-bold">Account</span>
          </span>
        </Link>

        <Link href="/cart" className="header-button">
          <ShoppingCartIcon className="h-8 w-8" />
          <span className="font-bold">Cart</span>
        </Link>
      </nav>
    </div>
  );
}
