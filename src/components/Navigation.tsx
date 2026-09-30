import { Link, useLocation, useNavigate } from "react-router-dom";
import { StaggeredMenu } from "./StaggeredMenu/StaggeredMenu";
import RubberSegment from "./RubberSegment/RubberSegment";
import { useTheme } from "@/context/ThemeContext";
import { useNetworkData } from "@/context/NetworkDataContext";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA6qxmKbLaD7ThdwfscOxdOjF63CQFk_FBeIqnSNpqn7rDO_lxT0UCJmmSVlpc_EoIpSUfqcc9sfkpfGjuy-iNm8N-nQ6wX0TfCYfWhDZCGvGyDZgp3L_KplPcfWO3GNdm2N4KJp-aJS4ma5bFujR8YiYTBFjChaESBC2-4LlojmilI4vw6itMoos0Ic9T0NFb9f2irMN39ETLu_Fe3Fy_o7b9AWwzHYQCe2-eK8V4";

const menuItems = [
  { label: "Dashboard", ariaLabel: "Go to dashboard", link: "/" },
  { label: "PHC Network", ariaLabel: "View PHC network", link: "/phc" },
  { label: "Alerts", ariaLabel: "View alerts", link: "/alerts" },
  { label: "Redistribution", ariaLabel: "Manage redistributions", link: "/redistributions" },
  { label: "Simulator", ariaLabel: "Open crisis simulator", link: "/simulator" },
  { label: "BRICS Network", ariaLabel: "BRICS health network", link: "/brics" },
  { label: "Assistant", ariaLabel: "Open AI assistant", link: "/assistant" },
];


// Map each route to a stable segment value
const NAV_LINKS = [
  { value: "Dashboard", href: "/" },
  { value: "PHC Network", href: "/phc" },
  { value: "Alerts", href: "/alerts" },
  { value: "Redistribution", href: "/redistributions" },
  { value: "Simulator", href: "/simulator" },
  { value: "BRICS Network", href: "/brics" },
  { value: "Assistant", href: "/assistant" },
];

/** Resolve current pathname → segment value (longest prefix wins, exact first) */
function pathnameToSegment(pathname: string): string {
  const exact = NAV_LINKS.find((l) => l.href === pathname);
  if (exact) return exact.value;
  const prefix = NAV_LINKS.filter((l) => l.href !== "/" && pathname.startsWith(l.href)).sort(
    (a, b) => b.href.length - a.href.length
  )[0];
  return prefix?.value ?? "Dashboard";
}

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { openDatasetModal, openPitchModal, startTour } = useNetworkData();

  const activeValue = pathnameToSegment(location.pathname);

  const handleSegmentChange = (value: string) => {
    const link = NAV_LINKS.find((l) => l.value === value);
    if (link) navigate(link.href);
  };

  const mobileActions = [
    { label: "▶ Demo Tour", link: "#tour", onClick: startTour },
    { label: "📄 Briefing", link: "#briefing", onClick: openPitchModal },
    { label: "📊 Datasets", link: "#dataset", onClick: openDatasetModal },
    { label: theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode", link: "#theme", onClick: toggle },
  ];

  return (
    <>
      {/* ─── DESKTOP NAV (xl and above) ─── */}
      <header className="hidden xl:flex w-full items-center justify-between gap-space-md mb-space-lg pb-space-sm">
        <Link to="/" className="flex items-center gap-space-sm shrink-0">
          <img
            alt="ArogyaNet Logo"
            className="h-8 w-auto object-contain"
            src={LOGO_URL}
          />
          <span className="font-headline-sm text-headline-sm text-text-primary tracking-tight">
            ArogyaNet
          </span>
        </Link>

        {/* ── RubberSegment nav ── */}
        <nav aria-label="Main navigation">
          <RubberSegment
            items={NAV_LINKS.map((l) => l.value)}
            value={activeValue}
            onChange={handleSegmentChange}
            aria-label="Main navigation"
            trackColor={theme === "dark" ? "#1A1D24" : "#F0F2F5"}
            thumbColor={theme === "dark" ? "#E8EAF0" : "#111318"}
            textColor={theme === "dark" ? "#E8EAF0" : "#111318"}
            activeTextColor={theme === "dark" ? "#111318" : "#ffffff"}
            size="md"
            radius={10}
            inset={3}
            equalSlots={false}
            stretch={90}
            squash={3}
            speed={1}
            glide={60}
            draggable
          />
        </nav>

        <div className="flex items-center gap-space-xs sm:gap-space-sm shrink-0">
          {/* 90s Judge Demo Tour Trigger */}
          <button
            onClick={startTour}
            aria-label="Start 90s Judge Demo Tour"
            title="Launch 90-Second Guided Judge Demo"
            className="px-3.5 py-1.5 rounded-full bg-teal-accent text-white font-label-sm text-xs font-bold shadow-sm hover:bg-teal-accent/90 transition-all flex items-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            <span>Demo Tour</span>
          </button>

          {/* Executive Pitch & Briefing */}
          <button
            onClick={openPitchModal}
            aria-label="Executive Briefing & Pitch"
            title="Open Executive Briefing & BRICS Framework"
            className="px-3 py-1.5 rounded-full bg-card-surface border border-border-hairline text-text-primary font-label-sm text-xs font-semibold hover:bg-surface-muted transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-teal-accent">description</span>
            <span>Briefing</span>
          </button>

          {/* Dataset & Scenarios Manager */}
          <button
            onClick={openDatasetModal}
            aria-label="Dataset & Scenario Manager"
            title="Upload CSV/JSON or load crisis scenario"
            className="w-10 h-10 rounded-full bg-card-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-[0_4px_14px_rgba(17,19,24,0.04)] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">dataset</span>
          </button>

          <Link
            to="/assistant"
            aria-label="Search"
            className="w-10 h-10 rounded-full bg-card-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-[0_4px_14px_rgba(17,19,24,0.04)]"
          >
            <span className="material-symbols-outlined text-lg">search</span>
          </Link>
          <Link
            to="/alerts"
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-full bg-card-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-[0_4px_14px_rgba(17,19,24,0.04)]"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-critical"></span>
          </Link>
          <button
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggle}
            className="w-10 h-10 rounded-full bg-card-surface border border-border-hairline flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors shadow-[0_4px_14px_rgba(17,19,24,0.04)] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
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

      {/* ─── MOBILE NAV (below xl): StaggeredMenu fixed overlay ─── */}
      <div className="xl:hidden h-16 mb-space-sm" aria-hidden="true" />
      <div className="xl:hidden fixed inset-0 pointer-events-none" style={{ zIndex: 50 }}>
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={mobileActions}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor={theme === "dark" ? "#E8EAF0" : "#111318"}
          openMenuButtonColor={theme === "dark" ? "#E8EAF0" : "#111318"}
          changeMenuColorOnOpen={false}
          colors={theme === "dark" ? ["#132A28", "#0F8F88"] : ["#E7F7F5", "#0F8F88"]}
          logoUrl={LOGO_URL}
          logoText="ArogyaNet"
          accentColor="#0F8F88"
          closeOnClickAway={true}
        />
      </div>
    </>
  );
}
