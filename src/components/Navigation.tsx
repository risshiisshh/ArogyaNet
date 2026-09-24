"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "PHC Network", href: "/phc" },
    { label: "Alerts", href: "/alerts" },
    { label: "Redistribution", href: "/redistributions" },
    { label: "Simulator", href: "/simulator" },
    { label: "BRICS Network", href: "/brics" },
    { label: "Assistant", href: "/assistant" },
  ];

  return (
    <header className="w-full flex items-center justify-between gap-space-md mb-space-lg pb-space-sm">
      <Link href="/" className="flex items-center gap-space-sm shrink-0">
        <img
          alt="ArogyaNet Logo"
          className="h-8 w-auto object-contain"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6qxmKbLaD7ThdwfscOxdOjF63CQFk_FBeIqnSNpqn7rDO_lxT0UCJmmSVlpc_EoIpSUfqcc9sfkpfGjuy-iNm8N-nQ6wX0TfCYfWhDZCGvGyDZgp3L_KplPcfWO3GNdm2N4KJp-aJS4ma5bFujR8YiYTBFjChaESBC2-4LlojmilI4vw6itMoos0Ic9T0NFb9f2irMN39ETLu_Fe3Fy_o7b9AWwzHYQCe2-eK8V4"
        />
        <span className="font-headline-sm text-headline-sm text-text-primary tracking-tight">
          ArogyaNet
        </span>
      </Link>

      <nav className="hidden xl:flex items-center gap-space-xs bg-surface-muted p-1 rounded-full border border-border-hairline">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href) ||
                (link.href.startsWith("/phc") && pathname.startsWith("/phc"));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-space-md py-space-xs rounded-full font-label-md text-label-md transition-colors ${
                isActive
                  ? "bg-text-primary text-white shadow-[0_4px_14px_rgba(17,19,24,0.08)]"
                  : "text-text-secondary hover:text-text-primary hover:bg-card-surface"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-space-xs sm:gap-space-sm shrink-0">
        <Link
          href="/assistant"
          aria-label="Search"
          className="w-10 h-10 rounded-full bg-card-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-[0_4px_14px_rgba(17,19,24,0.04)]"
        >
          <span className="material-symbols-outlined text-lg">search</span>
        </Link>
        <Link
          href="/alerts"
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-full bg-card-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-[0_4px_14px_rgba(17,19,24,0.04)]"
        >
          <span className="material-symbols-outlined text-lg">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-critical"></span>
        </Link>
        <button
          onClick={() => window.location.reload()}
          aria-label="Sync / Refresh"
          className="w-10 h-10 rounded-full bg-card-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-[0_4px_14px_rgba(17,19,24,0.04)]"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">sync</span>
        </button>
        <button
          aria-label="Display settings"
          className="w-10 h-10 rounded-full bg-card-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-[0_4px_14px_rgba(17,19,24,0.04)]"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">light_mode</span>
        </button>
        <div className="flex items-center gap-space-xs pl-space-xs">
          <img
            alt="District Admin avatar"
            className="w-8 h-8 rounded-full object-cover shadow-[0_2px_8px_rgba(17,19,24,0.08)] border border-border-hairline"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5mhhRZ0gF5xSOontnz9jwH_t1lv-0guZjwPTjifeh6wI_efFycjsDLO6421OtZAVJizMcLmfJ7k19K_B1HGwYPbiO-bKdMFoBwLQYYuKaSUyRJkA_SkernAocDklr7fpTWuXOmXT34NMpXwtkmvaBbEaGSJw4icD89_VC4jGYu1XcwN81MYGzPc5D-hf33FnaKb2_C00-6zZPlu2ySE0y-Pzl0bEzHCbKhH9Eb2U"
          />
        </div>
      </div>
    </header>
  );
}
