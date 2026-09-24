"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  return (
    <main className="flex-1 w-full">
      <div className="flex flex-col w-full gap-space-lg">
        {/* 1. Workspace Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <span className="font-body-sm text-body-sm text-text-secondary">
              Good morning, District Admin
            </span>
            <div className="flex items-center gap-space-sm flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
                PHC Network Overview
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-tint text-teal-accent font-label-sm text-label-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-accent animate-pulse"></span>
                <span>AI monitored</span>
              </div>
            </div>
          </div>
          {/* Right Cluster: Avatars & Scenario Action */}
          <div className="flex items-center gap-space-md shrink-0">
            <div className="flex items-center -space-x-2.5">
              <img
                className="w-8 h-8 rounded-full ring-2 ring-card-surface object-cover shadow-sm"
                alt="Public health officer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9KnD7soi8So0cA5oneCUweSmOZs1bAEdO8udZDwjR-vBdjtlfESaYIhU21Hg4SqpPXJcrbJ--Y2gufyHbbF3ym10fv9oWiOJSICpnc7sstkLayIMsh38FI1mi7MDsCEuFjU_ZC4IRKL8quHZ5mDlST7eIA75KMtUCVaDtMCth2t0Gwyu-JoZv1KVV-t5LJSz1DN7-Alm-vimMyfu3JDNPUj3m3FGeuryAxYtvirk"
              />
              <img
                className="w-8 h-8 rounded-full ring-2 ring-card-surface object-cover shadow-sm"
                alt="Logistics doctor"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9J2-cN2dTbzN8Kkqhqcx5pzmeemtUQ75vQEPLOLJX9u-fT27GSo4fMRcKQROj9cn0t49B4gu0P5iK8XNquP4tRJ1hQUqUnY9wXYHW5AZylOpunh4mPF_gZWTimqb6mrbQtTDukhhRaGnwLB116eT2JMrNVosTvughqBROG4xDCJMrQ7SeDi9PG3I4elZd_TBwOS0O6LXuwTm0CuMV-n4ugovFQ7JX3SB8HgY00ss"
              />
              <img
                className="w-8 h-8 rounded-full ring-2 ring-card-surface object-cover shadow-sm"
                alt="Medical inventory coordinator"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5EBW6qgbmNdFU9vL7Qu6moxpZ5elr_SL6TQ6KudEBkXOtvCd4UM0DXcKz177L5sVeiMHsXNmeP5MUe0GRpNcLH7aj06nHrcqLLZnzicOYcaDLSosG9xBGHxqju02rHLS5PgcZf0tPHHd6G7LHLYYMw7eAhBoKb-b88hmqRI_xia2gRzTm8CGXp6suQdBucEuvsDHGGHJ8eScEI7xJ2KaNKc4fW65QaG_GiCuR8aY"
              />
            </div>
            <Link
              href="/simulator"
              className="bg-text-primary text-on-primary rounded-full px-5 py-2.5 font-label-md text-label-md flex items-center gap-2 hover:bg-action-hover transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg leading-none">add</span>
              <span>Run scenario</span>
            </Link>
          </div>
        </section>

        {/* 2. Filter Row */}
        <section className="flex items-center gap-2 overflow-x-auto pb-1 -mt-1 scrollbar-none">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm shrink-0 transition-colors ${
              activeFilter === "all"
                ? "bg-text-primary text-on-primary"
                : "bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            type="button"
          >
            All PHCs
          </button>
          <button
            onClick={() => setActiveFilter("critical")}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm shrink-0 transition-colors ${
              activeFilter === "critical"
                ? "bg-text-primary text-on-primary"
                : "bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            type="button"
          >
            Critical (2)
          </button>
          <button
            onClick={() => setActiveFilter("attention")}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm shrink-0 transition-colors ${
              activeFilter === "attention"
                ? "bg-text-primary text-on-primary"
                : "bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            type="button"
          >
            Needs attention (3)
          </button>
          <button
            onClick={() => setActiveFilter("healthy")}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm shrink-0 transition-colors ${
              activeFilter === "healthy"
                ? "bg-text-primary text-on-primary"
                : "bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            type="button"
          >
            Healthy (13)
          </button>
          <Link
            href="/redistributions"
            className="bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm shrink-0 transition-colors"
          >
            Transfers
          </Link>
        </section>

        {/* 3. Main Top Two-Column Grid */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-stretch">
          {/* Left Column: Network Readiness Card (~58% / 7 cols) */}
          <div className="xl:col-span-7 bg-card-surface rounded-[24px] p-6 lg:p-7 shadow-[0_10px_30px_rgba(17,19,24,0.04)] flex flex-col justify-between gap-space-lg">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-tint text-teal-accent flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">vital_signs</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-text-primary">
                  Network Readiness
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  className="px-3 py-1 rounded-full bg-surface-muted text-text-primary font-label-sm text-label-sm inline-flex items-center gap-1 hover:bg-workspace-surface transition-colors"
                  type="button"
                >
                  <span>Today</span>
                  <span className="material-symbols-outlined text-sm text-text-secondary">
                    expand_more
                  </span>
                </button>
                <button
                  aria-label="More options"
                  className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">more_horiz</span>
                </button>
                <Link
                  href="/phc/PHC001"
                  aria-label="Expand card"
                  className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">open_in_full</span>
                </Link>
              </div>
            </div>

            {/* Card Body: Left Metric + Right Bar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              {/* Metric Summary Block */}
              <div className="md:col-span-4 flex flex-col gap-2">
                <span className="bg-green-tint text-green-healthy px-2.5 py-1 rounded-full font-label-sm text-label-sm inline-flex items-center gap-1 w-fit">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  <span>+4 prevented this week</span>
                </span>
                <div className="font-headline-lg text-headline-lg font-bold text-text-primary leading-none my-1 tracking-tight">
                  18
                </div>
                <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                  PHCs Monitored
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="bg-red-tint text-red-critical px-2.5 py-0.5 rounded-full font-label-sm text-label-sm">
                    2 critical
                  </span>
                  <span className="bg-amber-tint text-amber-accent px-2.5 py-0.5 rounded-full font-label-sm text-label-sm">
                    3 attention
                  </span>
                  <span className="bg-green-tint text-green-healthy px-2.5 py-0.5 rounded-full font-label-sm text-label-sm">
                    13 healthy
                  </span>
                </div>
              </div>

              {/* Vertical Bar Visualizer */}
              <div className="md:col-span-8 flex flex-col justify-end pt-4">
                <div className="relative h-44 w-full flex items-end justify-between px-3 pb-2 bg-workspace-surface rounded-2xl">
                  {/* Threshold Line */}
                  <div className="absolute inset-x-3 bottom-[50%] flex items-center pointer-events-none z-10">
                    <div className="w-full border-b border-dashed border-text-muted/40"></div>
                    <span className="absolute right-0 -top-4 font-body-sm text-body-sm text-text-muted bg-workspace-surface px-1.5 rounded">
                      risk threshold
                    </span>
                  </div>
                  {/* Bar 1: Rampur */}
                  <Link
                    href="/phc/PHC001"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-red-critical font-bold">
                      25%
                    </span>
                    <div className="w-8 h-10 bg-red-critical rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 2: Biswan */}
                  <Link
                    href="/phc/PHC003"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-amber-accent font-bold">
                      48%
                    </span>
                    <div className="w-8 h-20 bg-amber-accent rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 3: Laharpur */}
                  <Link
                    href="/phc/PHC005"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-amber-accent font-bold">
                      52%
                    </span>
                    <div className="w-8 h-22 bg-amber-accent rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 4: Khairabad */}
                  <Link
                    href="/phc/PHC007"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-green-healthy font-bold">
                      82%
                    </span>
                    <div className="w-8 h-32 bg-green-healthy rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 5: Hargaon */}
                  <Link
                    href="/phc/PHC004"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-green-healthy font-bold">
                      88%
                    </span>
                    <div className="w-8 h-34 bg-green-healthy rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 6: Maholi */}
                  <Link
                    href="/phc/PHC002"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-green-healthy font-bold">
                      95%
                    </span>
                    <div className="w-8 h-36 bg-green-healthy rounded-full transition-all group-hover:scale-105 shadow-sm relative">
                      <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-teal-accent rounded-full ring-2 ring-card-surface"></span>
                    </div>
                  </Link>
                </div>
                {/* Axis Labels */}
                <div className="flex items-center justify-between px-3 pt-2 text-center font-label-sm text-label-sm text-text-secondary">
                  <span className="w-11 truncate">Rampur</span>
                  <span className="w-11 truncate">Biswan</span>
                  <span className="w-11 truncate">Laharpur</span>
                  <span className="w-11 truncate">Khairabad</span>
                  <span className="w-11 truncate">Hargaon</span>
                  <span className="w-11 truncate">Maholi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Action Timeline Card (~42% / 5 cols) */}
          <div className="xl:col-span-5 bg-card-surface rounded-[24px] p-6 lg:p-7 shadow-[0_10px_30px_rgba(17,19,24,0.04)] flex flex-col justify-between gap-space-md">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-tint text-on-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary">
                    Action Timeline
                  </h2>
                  <p className="font-body-sm text-body-sm text-text-secondary">
                    Active &amp; scheduled moves
                  </p>
                </div>
              </div>
              <button
                aria-label="Timeline settings"
                className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-base">more_vert</span>
              </button>
            </div>

            {/* Date Ruler Grid */}
            <div className="grid grid-cols-6 gap-1 text-center py-2 px-1 bg-workspace-surface rounded-xl font-label-sm text-label-sm text-text-secondary">
              <div>
                <span className="block text-text-primary font-bold">20</span>
                <span className="text-[10px] text-text-muted">Fri</span>
              </div>
              <div>
                <span className="block text-text-primary font-bold">21</span>
                <span className="text-[10px] text-text-muted">Sat</span>
              </div>
              <div>
                <span className="block text-text-primary font-bold">22</span>
                <span className="text-[10px] text-text-muted">Sun</span>
              </div>
              <div>
                <span className="block text-text-secondary">23</span>
                <span className="text-[10px] text-text-muted">Mon</span>
              </div>
              <div>
                <span className="block text-text-secondary">24</span>
                <span className="text-[10px] text-text-muted">Tue</span>
              </div>
              <div>
                <span className="block text-text-secondary">25</span>
                <span className="text-[10px] text-text-muted">Wed</span>
              </div>
            </div>

            {/* Floating Scheduled Action Bars */}
            <div className="flex flex-col gap-2.5 flex-1 justify-center">
              {/* Urgent AI Transfer Bar (20-22 Sep) */}
              <Link
                href="/redistributions"
                className="bg-purple-tint p-3 rounded-2xl shadow-sm flex items-center justify-between gap-2 hover:brightness-98 transition-all"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-card-surface text-on-tertiary-container px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold tracking-tight">
                      AI Transfer
                    </span>
                    <span className="font-label-sm text-label-sm text-text-primary font-bold truncate">
                      ORS Transfer · Maholi → Rampur
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary truncate">
                    120 units · Prevents stockout in 2.5 days
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-text-secondary">
                  <span className="w-6 h-6 rounded-full bg-card-surface flex items-center justify-center font-label-sm text-label-sm font-bold text-text-primary">
                    M
                  </span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </div>
              </Link>

              {/* Review Task Bar (20-21 Sep) */}
              <Link
                href="/phc/PHC001"
                className="bg-amber-tint p-2.5 rounded-xl flex items-center justify-between gap-2"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-text-primary font-bold truncate">
                    Rampur restock review · 20–21 Sep
                  </span>
                  <span className="font-body-sm text-body-sm text-text-secondary">
                    Bed pressure 90%
                  </span>
                </div>
                <span className="bg-card-surface text-text-primary px-2 py-0.5 rounded-full font-label-sm text-label-sm shrink-0 font-medium">
                  Critical
                </span>
              </Link>

              {/* Scheduled Check Bar (23 Sep) */}
              <Link
                href="/alerts"
                className="bg-workspace-surface p-2.5 rounded-xl flex items-center justify-between gap-2"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-text-primary font-semibold truncate">
                    Biswan insulin check · 23 Sep
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted">
                    Reorder buffer: 3 days
                  </span>
                </div>
                <span className="material-symbols-outlined text-base text-text-secondary shrink-0">
                  check_circle
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Bottom Grid: Four Equal Floating White Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter items-stretch">
          {/* Card 1: District Map */}
          <div className="bg-card-surface rounded-[24px] p-5 shadow-[0_10px_30px_rgba(17,19,24,0.04)] flex flex-col justify-between gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-accent text-lg">
                  location_on
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary">
                  District Map
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-text-secondary bg-surface-muted px-2.5 py-0.5 rounded-full">
                Sitapur
              </span>
            </div>
            {/* Stylized District Map Illustration Canvas */}
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-workspace-surface p-3 flex flex-col justify-between">
              {/* District SVG Vector Map Outlines */}
              <svg
                className="absolute inset-0 w-full h-full text-outline-variant/30"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 200 160"
              >
                <polygon
                  fill="currentColor"
                  fillOpacity="0.25"
                  points="20,30 80,15 140,25 185,60 170,130 90,145 35,120 15,70"
                ></polygon>
                <path
                  d="M80,15 L90,85 L170,130 M90,85 L35,120 M90,85 L140,25"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                ></path>
              </svg>
              {/* Static Facility Nodes */}
              <Link
                href="/phc/PHC002"
                className="absolute top-8 left-14 flex items-center gap-1 hover:scale-105 transition-transform"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-healthy shadow-sm"></span>
                <span className="font-body-sm text-body-sm text-text-secondary">Maholi</span>
              </Link>
              <Link
                href="/phc/PHC004"
                className="absolute top-10 right-8 flex items-center gap-1 hover:scale-105 transition-transform"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-healthy shadow-sm"></span>
                <span className="font-body-sm text-body-sm text-text-secondary">Hargaon</span>
              </Link>
              <Link
                href="/phc/PHC003"
                className="absolute bottom-12 right-10 flex items-center gap-1 hover:scale-105 transition-transform"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-accent shadow-sm"></span>
                <span className="font-body-sm text-body-sm text-text-secondary">Biswan</span>
              </Link>
              {/* Center Highlight Pulse Node for Rampur */}
              <Link
                href="/phc/PHC001"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center hover:scale-110 transition-transform"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-red-critical opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-critical shadow"></span>
                </div>
              </Link>
              {/* Bottom Pill Banner on Map */}
              <div className="relative z-10 mt-auto flex justify-center">
                <Link
                  href="/phc/PHC001"
                  className="bg-text-primary text-on-primary font-label-sm text-label-sm px-3 py-1.5 rounded-full inline-flex items-center gap-2 shadow-md hover:bg-action-hover transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-red-critical animate-pulse"></span>
                  <span>Rampur PHC · Critical</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Coordination */}
          <div className="bg-card-surface rounded-[24px] p-5 shadow-[0_10px_30px_rgba(17,19,24,0.04)] flex flex-col justify-between gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-info text-lg">group</span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary">
                  Coordination
                </h3>
              </div>
              <button
                aria-label="Add contact"
                className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
              </button>
            </div>
            {/* Mini Search Input */}
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-text-muted text-base">
                search
              </span>
              <input
                className="w-full bg-workspace-surface rounded-full py-1.5 pl-9 pr-3 font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                placeholder="Search district officers..."
                type="text"
              />
            </div>
            {/* Contact Rows */}
            <div className="flex flex-col gap-2.5">
              {/* Row 1: Jane Cooper */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      className="w-8 h-8 rounded-full object-cover shadow-sm"
                      alt="Jane Cooper"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuArM4KgnWkjgyzrbIE9slQFZuIZOR0PIidJctk3hfVGSV3xNdnpD0ak-mTBBXjx2ZWINnLFsSxfB61HvuOk_KDhi0e__GpgGJkOTUDwFfCkM8j3ypZLOltAE1_dC4btC50jboW1UHLiVemGhTzmuD4DTuoTKa2bhzQZ_bF1YGuFPzGDn2EMPcWlXURW14bibmSM7fVY5BzbKHyWfjZ2iRSdN3IhptaEo53zP_9odik"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-healthy ring-1 ring-card-surface"></span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-text-primary font-semibold truncate">
                      Jane Cooper
                    </span>
                    <span className="font-body-sm text-body-sm text-text-muted truncate">
                      CMO Officer
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    aria-label="Call Jane Cooper"
                    className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                  </button>
                  <button
                    aria-label="Message Jane Cooper"
                    className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  </button>
                </div>
              </div>
              {/* Row 2: Kristin Watson */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      className="w-8 h-8 rounded-full object-cover shadow-sm"
                      alt="Kristin Watson"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBemg15_mXx6Y-C6tC5whmsPzHSyJi2b-NpuslW-8Nl_8WvDCygkDAqOi-65fN-57GXbPyvdy7pLkmF6NXkoXVBeKOsdq1j_Lhfik1dGpxRN0L-7l7yR1ttTiuQj2ikIxTPFdU_1VxN92lQ_7lioTbCJwu_CYqol8mOMc5kXG4w365O-3Cm6lDw4Jk00uVEcBKA5qQ9eWnVyat9-dApR47nnPbzxeRWcOWTcoQ_UZU"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-healthy ring-1 ring-card-surface"></span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-text-primary font-semibold truncate">
                      Kristin Watson
                    </span>
                    <span className="font-body-sm text-body-sm text-text-muted truncate">
                      Logistics Lead
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    aria-label="Call Kristin Watson"
                    className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                  </button>
                  <button
                    aria-label="Message Kristin Watson"
                    className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  </button>
                </div>
              </div>
              {/* Row 3: Jacob Jones */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      className="w-8 h-8 rounded-full object-cover shadow-sm"
                      alt="Jacob Jones"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3t92mLdB5hezWiSoq1mpJ7mMq7047QkKBNlsmH3eoS7tmmKBKz1NQqMf3hottaSTDf2g-e6xgfJ_IrQ78Zh7goB92R4MNYamsitKof3ITpKKJECYj5V9CamWqVKpgdZrLTtrUXA9v2rZhum9BlXTydek1XdlcpdRvdfk7lPI1qy8xevQ9azgWb_Lp00s7gW05vf6_kPvxfPcMCPIpPj1KnP4ySVzaW8AJoElwz9E"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-text-muted ring-1 ring-card-surface"></span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-text-primary font-semibold truncate">
                      Jacob Jones
                    </span>
                    <span className="font-body-sm text-body-sm text-text-muted truncate">
                      Rampur Pharmacist · 8m
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    aria-label="Call Jacob Jones"
                    className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                  </button>
                  <button
                    aria-label="Message Jacob Jones"
                    className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Medicine Coverage */}
          <div className="bg-card-surface rounded-[24px] p-5 shadow-[0_10px_30px_rgba(17,19,24,0.04)] flex flex-col justify-between gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-critical text-lg">
                  medication
                </span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary">
                  Medicine Coverage
                </h3>
              </div>
              <span
                className="material-symbols-outlined text-text-muted text-base"
                title="Estimated network shelf-life"
              >
                info
              </span>
            </div>
            {/* Metric & Threshold Pill */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg font-bold text-text-primary leading-none">
                  5.1
                </span>
                <span className="font-body-sm text-body-sm text-text-muted">avg days at risk</span>
              </div>
              <span className="font-label-sm text-label-sm text-amber-accent bg-amber-tint px-2 py-0.5 rounded-full inline-block mt-2 font-medium">
                Recommended 10+ days coverage
              </span>
            </div>
            {/* Item Coverage Progress Bars */}
            <div className="flex flex-col gap-2 mt-1">
              {/* ORS */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-text-secondary">ORS Sachets</span>
                  <span className="font-bold text-red-critical">2.5 days</span>
                </div>
                <div className="w-full h-1.5 bg-workspace-surface rounded-full overflow-hidden">
                  <div className="h-full bg-red-critical rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
              {/* Amoxicillin */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-text-secondary">Amoxicillin</span>
                  <span className="font-bold text-red-critical">2.7 days</span>
                </div>
                <div className="w-full h-1.5 bg-workspace-surface rounded-full overflow-hidden">
                  <div className="h-full bg-red-critical rounded-full" style={{ width: "27%" }}></div>
                </div>
              </div>
              {/* Insulin */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-text-secondary">Insulin</span>
                  <span className="font-semibold text-green-healthy">14.0 days</span>
                </div>
                <div className="w-full h-1.5 bg-workspace-surface rounded-full overflow-hidden">
                  <div className="h-full bg-green-healthy rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              {/* Paracetamol */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-text-secondary">Paracetamol</span>
                  <span className="font-semibold text-green-healthy">11.7 days</span>
                </div>
                <div className="w-full h-1.5 bg-workspace-surface rounded-full overflow-hidden">
                  <div className="h-full bg-green-healthy rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Bed Occupancy */}
          <div className="bg-card-surface rounded-[24px] p-5 shadow-[0_10px_30px_rgba(17,19,24,0.04)] flex flex-col justify-between gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-accent text-lg">
                  single_bed
                </span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-text-primary">
                    Bed Occupancy
                  </h3>
                </div>
              </div>
              <span className="font-body-sm text-body-sm text-text-secondary">Network avg</span>
            </div>
            {/* Occupancy Metrics */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg font-bold text-text-primary leading-none">
                  82%
                </span>
                <span className="font-body-sm text-body-sm text-text-muted">
                  occupied (164/200)
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-amber-accent inline-flex items-center gap-0.5 mt-1 font-semibold">
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                <span>+6% from yesterday</span>
              </span>
            </div>
            {/* Compact Amber Sparkline Area Visualization */}
            <div className="relative w-full h-20 bg-workspace-surface rounded-xl p-2 flex items-end">
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
              >
                <defs>
                  <linearGradient id="amberGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#F2C94C" stopOpacity="0.35"></stop>
                    <stop offset="100%" stopColor="#F2C94C" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M 0,35 Q 15,30 30,32 T 60,20 T 85,12 L 100,8 L 100,40 L 0,40 Z"
                  fill="url(#amberGradient)"
                ></path>
                <path
                  d="M 0,35 Q 15,30 30,32 T 60,20 T 85,12 L 100,8"
                  fill="none"
                  stroke="#F2C94C"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                ></path>
                <circle cx="100" cy="8" fill="#F2C94C" r="3"></circle>
              </svg>
            </div>
            {/* Footer Note */}
            <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-text-secondary pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-critical"></span>
              <span className="truncate">
                Rampur PHC peak: <strong className="text-text-primary">90% capacity</strong>
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
