"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ShopLink as Link, ShopNavLink as NavLink } from "../lib/navigation";

const account = "https://account.quincestone.com";
const worlds = [["Drive", "/drive"], ["Home", "/home-outdoor"], ["Pet", "/companion"], ["Travel", "/travel"], ["Work", "/products"]] as const;

function Lockup() {
  return <span className="qs-lockup"><Image src="/quincestone-mark.svg" alt="" width={25} height={25} /><strong>QUINCESTONE</strong><i>SHOP</i></span>;
}

export function ShopLayout({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const searchRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        setAccountOpen(false);
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const closeMenu = () => setMenu(false);

  return <div className="shop-shell">
    <a className="skip-link" href="#shop-content">Skip to products</a>
    <header className="qs-shop-header">
      <Link to="/" aria-label="Quincestone Shop home"><Lockup /></Link>
      <nav aria-label="Product worlds"><NavLink to="/products">Shop</NavLink>{worlds.map(([name, path]) => <NavLink key={name} to={path}>{name}</NavLink>)}</nav>
      <div className="qs-shop-utilities">
        <NavLink ref={searchRef} to="/search">Search</NavLink>
        <button type="button" aria-expanded={accountOpen} aria-controls="shop-account-menu" onClick={() => setAccountOpen((value) => !value)}>Account</button>
        <NavLink to="/bag">Bag</NavLink>
        <button className="qs-shop-menu-button" type="button" aria-expanded={menu} aria-controls="shop-mobile-menu" onClick={() => setMenu((value) => !value)}>Menu</button>
      </div>
      {accountOpen && <aside id="shop-account-menu" className="qs-account-menu" aria-label="Your Quincestone"><p>YOUR QUINCESTONE</p><a className="button" href={`${account}/sign-in?return_to=shop`}>Sign in</a><a href={`${account}/sign-up?return_to=shop`}>Create account</a><hr /><a href={`${account}/orders`}>Orders</a><a href={`${account}/saved`}>Saved</a><a href={`${account}/addresses`}>Addresses</a><a href={`${account}/profile`}>Profile</a><hr /><a href="https://app.quincestone.com">Open Business OS</a></aside>}
      <div id="shop-mobile-menu" className="qs-shop-mobile" data-open={menu}>{worlds.map(([name, path]) => <NavLink key={name} to={path} onClick={closeMenu}>{name}</NavLink>)}<NavLink to="/standard" onClick={closeMenu}>How we choose</NavLink><a href="https://www.quincestone.com">About Quincestone</a></div>
    </header>
    <main id="shop-content">{children}</main>
    <footer className="qs-shop-footer"><div><Lockup /><p>Better things, chosen carefully.</p></div><nav aria-label="Shop footer"><div><strong>SHOP</strong><Link to="/products">All products</Link><Link to="/new">New</Link><Link to="/standard">How we choose</Link></div><div><strong>ACCOUNT</strong><a href={`${account}/sign-in?return_to=shop`}>Sign in</a><a href={`${account}/sign-up?return_to=shop`}>Create account</a><a href={`${account}/orders`}>Orders</a><a href={`${account}/saved`}>Saved</a></div><div><strong>HELP</strong><Link to="/shipping">Shipping</Link><Link to="/returns">Returns</Link><Link to="/support">Support</Link></div><div><strong>QUINCESTONE</strong><a href="https://www.quincestone.com">Company</a><a href="https://www.quincestone.com/security">Security</a><a href="https://www.quincestone.com/contact">Contact</a></div></nav><small>One Quincestone · Commerce mode</small></footer>
  </div>;
}
