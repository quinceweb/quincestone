import { useEffect, useLayoutEffect, useRef, useState, type ComponentRef } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "../marketing.css";
import "../p2-interaction.css";
import "../web-reconciliation.css";
import "../footer-mobile-architecture.css";
import { CorporateFooter } from "./CorporateFooter";
import { CorporateBrand } from "./CorporateBrand";

type Item={label:string;to:string;description:string;external?:boolean};
const searchItems:Item[]=[
  {label:"Platform",to:"/platform",description:"The Quincestone operating model."},
  {label:"Edge",to:"/edge",description:"Governed intelligence with an authority boundary."},
  {label:"Business",to:"/business",description:"Business operating systems and authorized work."},
  {label:"Commerce",to:"/commerce",description:"Demand-led product and commerce systems."},
  {label:"About",to:"/about",description:"Why Quincestone exists and how it operates."},
  {label:"Security",to:"/security",description:"Security and operating boundaries."}
];

const platform:Item[]=[
  {label:"Understand demand",to:"/discover",description:"See what people need before choosing the system."},
  {label:"Build the experience",to:"/build",description:"Turn understanding into a useful customer path."},
  {label:"Operate the work",to:"/operate",description:"Route qualified demand through governed operations."},
  {label:"Learn from outcomes",to:"/scale",description:"Connect action to evidence and improve."}
]¶»§q«^