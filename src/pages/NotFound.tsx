import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto flex items-center justify-center py-16 px-4">
      <div className="w-full bg-card-surface border border-border-hairline rounded-3xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex flex-col items-center text-center">
        {/* Badge & Icon */}
        <div className="w-20 h-20 rounded-3xl bg-teal-tint text-teal-accent flex items-center justify-center mb-6 shadow-sm border border-teal-accent/20">
          <span className="material-symbols-outlined text-[44px]">satellite_alt</span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-tint text-amber-accent font-label-sm text-xs font-semibold uppercase tracking-wider mb-3">
          Error 404 · Unresolved Node
        </span>

        <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight mb-3">
          Facility Coordinate Not Found
        </h1>

        <p className="font-body-md text-body-md text-text-secondary max-w-md mb-8 leading-relaxed">
          The public health telemetry route, facility record, or node endpoint you are attempting to reach does not exist or has been reallocated across the Sitapur district grid.
        </p>

        {/* Quick Recovery Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md text-left mb-8">
          <Link
            to="/"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-muted hover:bg-surface-container-high border border-border-hairline hover:border-teal-accent/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-card-surface flex items-center justify-center text-teal-accent shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">dashboard</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-sm font-semibold text-text-primary">District Dashboard</span>
              <span className="font-body-sm text-[11px] text-text-muted">Return to operational overview</span>
            </div>
          </Link>

          <Link
            to="/phc"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-muted hover:bg-surface-container-high border border-border-hairline hover:border-teal-accent/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-card-surface flex items-center justify-center text-teal-accent shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">local_hospital</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-sm font-semibold text-text-primary">PHC Registry</span>
              <span className="font-body-sm text-[11px] text-text-muted">Browse all 18 primary clinics</span>
            </div>
          </Link>

          <Link
            to="/assistant"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-muted hover:bg-surface-container-high border border-border-hairline hover:border-teal-accent/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-card-surface flex items-center justify-center text-teal-accent shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-sm font-semibold text-text-primary">AI Copilot</span>
              <span className="font-body-sm text-[11px] text-text-muted">Query telemetry in natural language</span>
            </div>
          </Link>

          <Link
            to="/alerts"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-muted hover:bg-surface-container-high border border-border-hairline hover:border-teal-accent/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-card-surface flex items-center justify-center text-teal-accent shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">notifications</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-sm font-semibold text-text-primary">Active Alerts</span>
              <span className="font-body-sm text-[11px] text-text-muted">Triage early stockout warnings</span>
            </div>
          </Link>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary text-on-primary font-label-md text-sm font-semibold hover:bg-action-hover transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Back to Command Centre</span>
        </Link>
      </div>
    </main>
  );
}
