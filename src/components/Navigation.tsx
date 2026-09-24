"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hospital,
  AlertTriangle,
  ArrowLeftRight,
  Sliders,
  Globe2,
  Bot,
  Activity,
  ShieldCheck,
} from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "PHC Detail", href: "/phc/PHC001", icon: Hospital },
    {
      label: "Early Warnings",
      href: "/alerts",
      icon: AlertTriangle,
      badge: "4 Critical",
      badgeColor: "bg-[#FDE8E8] text-[#D93838]",
    },
    {
      label: "Redistribution",
      href: "/redistributions",
      icon: ArrowLeftRight,
      badge: "AI Plan",
      badgeColor: "bg-[#E7F7F5] text-[#0F8F88]",
    },
    { label: "Emergency Simulator", href: "/simulator", icon: Sliders },
    { label: "BRICS Compare", href: "/brics", icon: Globe2 },
    { label: "Admin Assistant", href: "/assistant", icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E7E9EE] shadow-sm">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#0F8F88] flex items-center justify-center text-white shadow-md shadow-[#0F8F88]/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-[#111318]">
                  Arogya<span className="text-[#0F8F88]">Net</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E5F6EE] text-[#248A54] border border-[#248A54]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#248A54] animate-pulse"></span>
                  LIVE OPS
                </span>
              </div>
              <p className="text-[11px] text-[#626875] -mt-0.5 hidden sm:block">
                Health Network Resilience Platform
              </p>
            </div>
          </Link>

          {/* Navigation Pills */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#F8F8FA] p-1.5 rounded-full border border-[#E7E9EE]">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href) ||
                    (item.href.startsWith("/phc") && pathname.startsWith("/phc"));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#111318] text-white shadow-sm"
                      : "text-[#626875] hover:text-[#111318] hover:bg-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold leading-none ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Top Right System Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex flex-col items-end text-right">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111318]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F8F88]" />
                <span>Sitapur & Hardoi Grid</span>
              </div>
              <span className="text-[10px] text-[#8D93A1]">18 PHCs Monitored • Synced 2m ago</span>
            </div>

            <div className="h-8 w-px bg-[#E7E9EE] hidden md:block"></div>

            <Link
              href="/alerts"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#D93838] text-white hover:bg-[#b82929] transition-colors shadow-sm shadow-red-500/20"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Critical Alerts</span>
              <span className="bg-white/25 px-1.5 py-0.2 rounded-full text-[10px]">
                4
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile / Compact Nav Pills */}
        <div className="xl:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-[#E7E9EE]">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) ||
                  (item.href.startsWith("/phc") && pathname.startsWith("/phc"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? "bg-[#111318] text-white"
                    : "text-[#626875] bg-[#F8F8FA] hover:bg-gray-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
