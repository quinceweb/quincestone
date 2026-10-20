import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

const model = [
  ["01", "Discover", "Find meaningful demand."],
  ["02", "Build", "Create the experience around it."],
  ["03", "Operate", "Move the work toward an outcome."],
  ["04", "Scale", "Learn from what actually works."],
] as const;

const outcomes = [
  ["01", "Capture more qualified demand", "Make the public journey clearer, collect the right context, and turn interest into a structured next step.", "/assessment", "Start an assessment"],
  ["02", "Move requests toward action", "Connect interaction, intelligence, policy, routing, and human judgment so work does not stop at the front door.", "/edge", "Explore Edge"],
  ["03", "Build a better commerce path", "Discover what people want, validate the opportunity, source carefully, transact clearly, and learn from outcomes.", "/commerce", "Explore Commerce"],
  ["04", "Create operating control", "Make important work visible, governed, reviewable, and easier to improve as the system learns.", "/operations", "See Operations"],
] as const;

const edgeStages = ["Demand", "Interaction", "Edge", "Understand", "Qualify", "Knowledge", "Policy", "Workflow", "Human decision", "Authorized action", "Outcome", "Trace", "Learning"];
const systemStages = ["Understand", "Qualify", "Apply policy", "Route"] as const;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`qs-reveal ${¶»§q«^