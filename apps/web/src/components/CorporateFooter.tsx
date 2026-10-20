import { Link } from "react-router-dom";
import "../corporate-footer.css";
import { CorporateBrand } from "./CorporateBrand";

type FooterLink = { label: string; to: string; external?: boolean };
type FooterGroup = { label: string; links: FooterLink[] };

const groups: FooterGroup[] = [
  {
    label: "Platform",
    links: [
      { label: "Platform", to: "/platform" },
      { label: "Intelligence", to: "/intelligence" },
      { label: "Operations", to: "/operate" },
      { label: "Outcomes", to: "/scale" },
    ],
  },
  {
    label: "Products",
    links: [
      { label: "Business", to: "/business" },
      { label: "Edge", to: "/edge" },
      { label: "Shop", to: "https://shop.quincestone.com", external: true },
      { label: "Deals", to: "https://quincestonedeals.app", external: true },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "Sign in", to: "https://app.quincestone.com/sign-in", external: true },
      { label: "Create account", to: "https://app.quincestone.com/sign-up", external: true },
      { label: "Orders", to: "https://app.quincestone.com/account/orders", external: true },
      { label: "Saved", to: "https://app.quincestone.com/account/saved", external: true },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Principles", to: "/about" },
      { label: "Security", to: "/security" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const legal: FooterLink[] = [
  {¶»§q«^