import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNetworkData } from "@/context/NetworkDataContext";
import { DistrictMap } from "@/components/InteractiveMap/DistrictMap";
import { exportPHCNetworkCSV, printExecutiveReport } from "@/lib/exportUtils";

// ── Contacts data ──────────────────────────────────────────────
const CONTACTS = [
  {
    id: "c1",
    name: "Jane Cooper",
    role: "CMO Officer",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuArM4KgnWkjgyzrbIE9slQFZuIZOR0PIidJctk3hfVGSV3xNdnpD0ak-mTBBXjx2ZWINnLFsSxfB61HvuOk_KDhi0e__GpgGJkOTUDwFfCkM8j3ypZLOltAE1_dC4btC50jboW1UHLiVemGhTzmuD4DTuoTKa2bhzQZ_bF1YGuFPzGDn2EMPcWlXURW14bibmSM7fVY5BzbKHyWfjZ2iRSdN3IhptaEo53zP_9odik",
    online: true,
    phone: "+91 98765 43210",
  },
  {
    id: "c2",
    name: "Kristin Watson",
    role: "Logistics Lead",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBemg15_mXx6Y-C6tC5whmsPzHSyJi2b-NpuslW-8Nl_8WvDCygkDAqOi-65fN-57GXbPyvdy7pLkmF6NXkoXVBeKOsdq1j_Lhfik1dGpxRN0L-7l7yR1ttTiuQj2ikIxTPFdU_1VxN92lQ_7lioTbCJwu_CYqol8mOMc5kXG4w365O-3Cm6lDw4Jk00uVEcBKA5qQ9eWnVyat9-dApR47nnPbzxeRWcOWTcoQ_UZU",
    online: true,
    phone: "+91 98765 43211",
  },
  {
    id: "c3",
    name: "Jacob Jones",
    role: "Rampur Pharmacist · 8m",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3t92mLdB5hezWiSoq1mpJ7mMq7047QkKBNlsmH3eoS7tmmKBKz1NQqMf3hottaSTDf2g-e6xgfJ_IrQ78Zh7goB92R4MNYamsitKof3ITpKKJECYj5V9CamWqVKpgdZrLTtrUXA9v2rZhum9BlXTydek1XdlcpdRvdfk7lPI1qy8xevQ9azgWb_Lp00s7gW05vf6_kPvxfPcMCPIpPj1KnP4ySVzaW8AJoElwz9E",
    online: false,
    phone: "+91 98765 43212",
  },
];

// ── Toast component ────────────────────────────────────────────
function Toast({
  message,
  icon,
  onClose,
}: {
  message: string;
  icon: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-6 z-[100] bg-card-surface border border-border-hairline rounded-2xl px-5 py-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.2)] flex items-center gap-3 animate-fade-in max-w-sm">
      <span className="material-symbols-outlined text-teal-accent text-lg">
        {icon}
      </span>
      <span className="font-label-md text-label-md text-text-primary">
        {message}
      </span>
      <button
        onClick={onClose}
        className="ml-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        type="button"
        aria-label="Dismiss notification"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}

// ── Popover Dropdown hook ──────────────────────────────────────
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return { open, setOpen, ref };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { enrichedPHCs, summary, openDatasetModal } = useNetworkData();

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    icon: string;
  } | null>(null);

  // Contact search
  const [contactSearch, setContactSearch] = useState("");

  // Dropdown states
  const timeRangePopover = usePopover();
  const [selectedTimeRange, setSelectedTimeRange] = useState("Today");
  const moreOptionsPopover = usePopover();
  const timelineSettingsPopover = usePopover();

  // Info tooltip
  const infoPopover = usePopover();

  // Add Contact modal
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactRole, setNewContactRole] = useState("");
  const [localContacts, setLocalContacts] = useState(CONTACTS);

  const filteredPHCs = enrichedPHCs.filter((p) => {
    if (activeFilter === "critical") return p.status === "critical";
    if (activeFilter === "attention") return p.status === "low";
    if (activeFilter === "healthy") return p.status === "healthy";
    return true;
  });

  // Filtered contacts based on search
  const filteredContacts = localContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.role.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const showToast = (message: string, icon: string = "check_circle") => {
    setToast({ message, icon });
  };

  const handleCall = (name: string, phone: string) => {
    showToast(`Calling ${name} at ${phone}...`, "call");
  };

  const handleMessage = (name: string) => {
    showToast(`Opening secure chat with ${name}...`, "chat_bubble");
  };

  const handleAddContact = () => {
    if (!newContactName.trim()) return;
    const newContact = {
      id: `c${Date.now()}`,
      name: newContactName.trim(),
      role: newContactRole.trim() || "District Officer",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newContactName.trim())}&background=0F8F88&color=fff&size=128`,
      online: true,
      phone: "+91 00000 00000",
    };
    setLocalContacts((prev) => [...prev, newContact]);
    setNewContactName("");
    setNewContactRole("");
    setShowAddContact(false);
    showToast(`${newContact.name} added to coordination list`, "person_add");
  };

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
            <button
              onClick={openDatasetModal}
              className="bg-card-surface border border-border-hairline text-text-primary rounded-full px-4 py-2.5 font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-muted transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-lg leading-none text-teal-accent">dataset</span>
              <span>Manage Data</span>
            </button>
            <Link
              to="/simulator"
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
            All PHCs ({summary.total})
          </button>
          <button
            onClick={() => setActiveFilter("critical")}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm shrink-0 transition-colors ${
              activeFilter === "critical"
                ? "bg-red-critical text-white"
                : "bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            type="button"
          >
            Critical ({summary.critical})
          </button>
          <button
            onClick={() => setActiveFilter("attention")}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm shrink-0 transition-colors ${
              activeFilter === "attention"
                ? "bg-amber-accent text-white"
                : "bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            type="button"
          >
            Needs attention ({summary.low})
          </button>
          <button
            onClick={() => setActiveFilter("healthy")}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm shrink-0 transition-colors ${
              activeFilter === "healthy"
                ? "bg-green-healthy text-white"
                : "bg-card-surface text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            type="button"
          >
            Healthy ({summary.healthy})
          </button>
          <Link
            to="/redistributions"
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
                {/* ── TIME RANGE DROPDOWN (was no-op) ── */}
                <div className="relative" ref={timeRangePopover.ref}>
                  <button
                    onClick={() => timeRangePopover.setOpen(!timeRangePopover.open)}
                    className="px-3 py-1 rounded-full bg-surface-muted text-text-primary font-label-sm text-label-sm inline-flex items-center gap-1 hover:bg-workspace-surface transition-colors cursor-pointer"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={timeRangePopover.open}
                  >
                    <span>{selectedTimeRange}</span>
                    <span className="material-symbols-outlined text-sm text-text-secondary" style={{ transform: timeRangePopover.open ? "rotate(180deg)" : "none", transition: "transform 200ms" }}>
                      expand_more
                    </span>
                  </button>
                  {timeRangePopover.open && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-card-surface rounded-xl border border-border-hairline shadow-[0_12px_30px_rgba(0,0,0,0.15)] py-1 z-50 animate-fade-in">
                      {["Today", "This Week", "This Month", "Last 7 Days", "Last 30 Days"].map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setSelectedTimeRange(range);
                            timeRangePopover.setOpen(false);
                            showToast(`Network Readiness: showing ${range} data`, "calendar_today");
                          }}
                          className={`w-full text-left px-4 py-2 font-label-sm text-label-sm transition-colors cursor-pointer ${
                            selectedTimeRange === range
                              ? "bg-teal-tint text-teal-accent font-bold"
                              : "text-text-primary hover:bg-surface-muted"
                          }`}
                          type="button"
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── MORE OPTIONS MENU (was no-op) ── */}
                <div className="relative" ref={moreOptionsPopover.ref}>
                  <button
                    onClick={() => moreOptionsPopover.setOpen(!moreOptionsPopover.open)}
                    aria-label="More options"
                    className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={moreOptionsPopover.open}
                  >
                    <span className="material-symbols-outlined text-base">more_horiz</span>
                  </button>
                  {moreOptionsPopover.open && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-card-surface rounded-xl border border-border-hairline shadow-[0_12px_30px_rgba(0,0,0,0.15)] py-1 z-50 animate-fade-in">
                      <button
                        onClick={() => {
                          moreOptionsPopover.setOpen(false);
                          showToast("Refreshing network telemetry...", "sync");
                        }}
                        className="w-full text-left px-4 py-2.5 font-label-sm text-label-sm text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm text-text-secondary">sync</span>
                        <span>Refresh Data</span>
                      </button>
                      <button
                        onClick={() => {
                          moreOptionsPopover.setOpen(false);
                          navigate("/phc");
                        }}
                        className="w-full text-left px-4 py-2.5 font-label-sm text-label-sm text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm text-text-secondary">grid_view</span>
                        <span>View All PHCs</span>
                      </button>
                      <button
                        onClick={() => {
                          moreOptionsPopover.setOpen(false);
                          exportPHCNetworkCSV(enrichedPHCs);
                          showToast("Full Sitapur facility inventory exported as CSV", "download");
                        }}
                        className="w-full text-left px-4 py-2.5 font-label-sm text-label-sm text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm text-teal-accent">download</span>
                        <span>Export Full Telemetry (CSV)</span>
                      </button>
                      <button
                        onClick={() => {
                          moreOptionsPopover.setOpen(false);
                          printExecutiveReport(enrichedPHCs);
                          showToast("Generating CMO Executive Dispatch preview...", "print");
                        }}
                        className="w-full text-left px-4 py-2.5 font-label-sm text-label-sm text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm text-teal-accent">print</span>
                        <span>Print Executive Dispatch</span>
                      </button>
                      <div className="my-1 border-t border-border-hairline"></div>
                      <button
                        onClick={() => {
                          moreOptionsPopover.setOpen(false);
                          navigate("/alerts");
                        }}
                        className="w-full text-left px-4 py-2.5 font-label-sm text-label-sm text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm text-red-critical">notifications_active</span>
                        <span>View Active Alerts</span>
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to="/phc/PHC001"
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
                    to="/phc/PHC001"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-red-critical font-bold">
                      25%
                    </span>
                    <div className="w-8 h-10 bg-red-critical rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 2: Biswan */}
                  <Link
                    to="/phc/PHC003"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-amber-accent font-bold">
                      48%
                    </span>
                    <div className="w-8 h-20 bg-amber-accent rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 3: Laharpur */}
                  <Link
                    to="/phc/PHC005"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-amber-accent font-bold">
                      52%
                    </span>
                    <div className="w-8 h-22 bg-amber-accent rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 4: Khairabad */}
                  <Link
                    to="/phc/PHC007"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-green-healthy font-bold">
                      82%
                    </span>
                    <div className="w-8 h-32 bg-green-healthy rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 5: Hargaon */}
                  <Link
                    to="/phc/PHC004"
                    className="flex flex-col items-center gap-1.5 group z-20 w-11 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-label-sm text-label-sm text-green-healthy font-bold">
                      88%
                    </span>
                    <div className="w-8 h-34 bg-green-healthy rounded-full transition-all group-hover:scale-105 shadow-sm"></div>
                  </Link>
                  {/* Bar 6: Maholi */}
                  <Link
                    to="/phc/PHC002"
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
              {/* ── TIMELINE SETTINGS MENU (was no-op) ── */}
              <div className="relative" ref={timelineSettingsPopover.ref}>
                <button
                  onClick={() => timelineSettingsPopover.setOpen(!timelineSettingsPopover.open)}
                  aria-label="Timeline settings"
                  className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={timelineSettingsPopover.open}
                >
                  <span className="material-symbols-outlined text-base">more_vert</span>
                </button>
                {timelineSettingsPopover.open && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-card-surface rounded-xl border border-border-hairline shadow-[0_12px_30px_rgba(0,0,0,0.15)] py-1 z-50 animate-fade-in">
                    <button
                      onClick={() => {
                        timelineSettingsPopover.setOpen(false);
                        navigate("/redistributions");
                      }}
                      className="w-full text-left px-4 py-2.5 font-label-sm text-label-sm text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm text-text-secondary">swap_horiz</span>
                      <span>View All Transfers</span>
                    </button>
                    <button
                      onClick={() => {
                        timelineSettingsPopover.setOpen(false);
                        navigate("/simulator");
                      }}
                      className="w-full text-left px-4 py-2.5 font-label-sm text-label-sm text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm text-text-secondary">science</span>
                      <span>Run New Scenario</span>
                    </button>
                    <div className="my-1 border-t border-border-hairline"></div>
                    <button
                      onClick={() => {
                        timelineSettingsPopover.setOpen(false);
                        showToast("Timeline view refreshed", "refresh");
                      }}
                      className="w-full text-left px-4 py-2.5 font-label-sm text-label-sm text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm text-text-secondary">refresh</span>
                      <span>Refresh Timeline</span>
                    </button>
                    <button
                      onClick={() => {
                        timelineSettingsPopover.setOpen(false);
                        navigate("/alerts");
                      }}
                      className="w-full text-left px-4 py-2.5 font-label-sm text-label-sm text-text-primary hover:bg-surface-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm text-text-secondary">notifications</span>
                      <span>Manage Alerts</span>
                    </button>
                  </div>
                )}
              </div>
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
                to="/redistributions"
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
                to="/phc/PHC001"
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
                to="/alerts"
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

        {/* 4. Interactive District Geospatial Tactical Grid */}
        <section className="w-full">
          <DistrictMap
            phcs={enrichedPHCs}
            onSelectPhc={(phc) => navigate(`/phc/${phc.phc_id}`)}
          />
        </section>

        {/* 5. Bottom Grid: Three Equal Operations & Status Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
          {/* Card 1: Coordination */}
          <div className="bg-card-surface rounded-[24px] p-5 shadow-[0_10px_30px_rgba(17,19,24,0.04)] flex flex-col justify-between gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-info text-lg">group</span>
                <h3 className="font-headline-sm text-headline-sm text-text-primary">
                  Coordination
                </h3>
              </div>
              {/* ── ADD CONTACT BUTTON (was no-op) ── */}
              <button
                onClick={() => setShowAddContact(true)}
                aria-label="Add contact"
                className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
              </button>
            </div>
            {/* ── SEARCH INPUT (now functional) ── */}
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-text-muted text-base">
                search
              </span>
              <input
                className="w-full bg-workspace-surface rounded-full py-1.5 pl-9 pr-3 font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-teal-accent/30 transition-shadow"
                placeholder="Search district officers..."
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />
              {contactSearch && (
                <button
                  onClick={() => setContactSearch("")}
                  className="absolute right-3 text-text-muted hover:text-text-primary cursor-pointer"
                  type="button"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            {/* Contact Rows */}
            <div className="flex flex-col gap-2.5">
              {filteredContacts.length === 0 && (
                <div className="text-center py-3 font-body-sm text-body-sm text-text-muted">
                  No contacts match "{contactSearch}"
                </div>
              )}
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        className="w-8 h-8 rounded-full object-cover shadow-sm"
                        alt={contact.name}
                        src={contact.avatar}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-card-surface ${
                          contact.online ? "bg-green-healthy" : "bg-text-muted"
                        }`}
                      ></span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-text-primary font-semibold truncate">
                        {contact.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-text-muted truncate">
                        {contact.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {/* ── CALL BUTTON (now functional) ── */}
                    <button
                      onClick={() => handleCall(contact.name, contact.phone)}
                      aria-label={`Call ${contact.name}`}
                      className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-green-healthy hover:bg-green-tint transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                    </button>
                    {/* ── MESSAGE BUTTON (now functional) ── */}
                    <button
                      onClick={() => handleMessage(contact.name)}
                      aria-label={`Message ${contact.name}`}
                      className="w-7 h-7 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-teal-accent hover:bg-teal-tint transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                    </button>
                  </div>
                </div>
              ))}
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
              {/* ── INFO TOOLTIP (now a proper popover) ── */}
              <div className="relative" ref={infoPopover.ref}>
                <button
                  onClick={() => infoPopover.setOpen(!infoPopover.open)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
                  type="button"
                  aria-label="Medicine coverage info"
                  aria-expanded={infoPopover.open}
                >
                  <span className="material-symbols-outlined text-base">info</span>
                </button>
                {infoPopover.open && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-card-surface rounded-xl border border-border-hairline shadow-[0_12px_30px_rgba(0,0,0,0.15)] p-4 z-50 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-teal-accent text-sm">info</span>
                      <span className="font-label-sm text-label-sm text-text-primary font-bold">Coverage Methodology</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                      Shows the average days of supply remaining across all monitored facilities. Calculated as{" "}
                      <strong className="text-text-primary">quantity ÷ daily consumption rate</strong> per medicine. Items below 3 days are flagged critical.
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-xs">
                      <Link
                        to="/redistributions"
                        className="text-teal-accent font-semibold hover:underline"
                        onClick={() => infoPopover.setOpen(false)}
                      >
                        View rebalancing recommendations →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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

      {/* ── TOAST NOTIFICATIONS ── */}
      {toast && (
        <Toast
          message={toast.message}
          icon={toast.icon}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── ADD CONTACT MODAL ── */}
      {showAddContact && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-card-surface w-full max-w-md rounded-2xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-border-hairline flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-teal-tint text-teal-accent flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">person_add</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-text-primary">
                  Add Contact
                </h3>
              </div>
              <button
                onClick={() => setShowAddContact(false)}
                className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                type="button"
                aria-label="Close add contact modal"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block font-label-sm text-label-sm text-text-secondary mb-1" htmlFor="new-contact-name">
                  Full Name *
                </label>
                <input
                  id="new-contact-name"
                  className="w-full bg-workspace-surface border border-border-hairline rounded-xl px-4 py-2.5 font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal-accent/30 transition-shadow"
                  placeholder="e.g. Dr. Priya Sharma"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddContact()}
                  autoFocus
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-text-secondary mb-1" htmlFor="new-contact-role">
                  Role / Designation
                </label>
                <input
                  id="new-contact-role"
                  className="w-full bg-workspace-surface border border-border-hairline rounded-xl px-4 py-2.5 font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal-accent/30 transition-shadow"
                  placeholder="e.g. Block Health Officer"
                  value={newContactRole}
                  onChange={(e) => setNewContactRole(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddContact()}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setShowAddContact(false)}
                className="px-4 py-2 rounded-full bg-surface-muted text-text-primary font-label-md text-label-md hover:bg-workspace-surface transition-colors cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                disabled={!newContactName.trim()}
                className="px-5 py-2 rounded-full bg-teal-accent text-white font-label-md text-label-md shadow-sm hover:bg-teal-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                type="button"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
