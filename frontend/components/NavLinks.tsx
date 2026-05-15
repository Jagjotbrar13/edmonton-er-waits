"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Info, LayoutDashboard } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/compare", label: "Compare", icon: BarChart3 },
  { href: "/insights", label: "Insights", icon: Activity },
  { href: "/#ml", label: "About ML", icon: Info }
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 rounded-xl bg-slate-100/70 p-1 text-sm text-slate-600">
      {links.map((link) => {
        const Icon = link.icon;
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/80 hover:text-slate-950 ${
              active ? "bg-white text-slate-950 shadow-sm" : ""
            }`}
            href={link.href}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
