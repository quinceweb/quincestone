"use client";

import Link from "next/link";
import { useParams as useNextParams, usePathname } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

type ShopLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  children: ReactNode;
};

export const ShopLink = forwardRef<HTMLAnchorElement, ShopLinkProps>(
  function ShopLink({ to, children, ...props }, ref) {
    return <Link href={to} ref={ref} {...props}>{children}</Link>;
  },
);

export const ShopNavLink = forwardRef<HTMLAnchorElement, ShopLinkProps>(
  function ShopNavLink({ to, className, children, ...props }, ref) {
    const pathname = usePathname() ?? "/";
    const active = pathname === to || (to !== "/" && pathname.startsWith(`${to}/`));
    const resolvedClassName = [className, active ? "active" : ""].filter(Boolean).join(" ");
    return <Link href={to} ref={ref} className={resolvedClassName || undefined} aria-current={active ? "page" : undefined} {...props}>{children}</Link>;
  },
);

export function useShopParams() {
  return useNextParams<Record<string, string>>() ?? {};
}
