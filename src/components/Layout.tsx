import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

export function Layout() {
  return (
    <div className="min-h-screen overflow-x-hidden p-0 sm:p-space-sm lg:p-space-lg xl:p-margin flex flex-col justify-start items-center">
      <div className="w-full max-w-[1440px] bg-workspace-surface sm:rounded-lg shadow-none sm:shadow-[0_18px_45px_rgba(17,19,24,0.08)] flex flex-col min-h-screen sm:min-h-[860px] p-space-md sm:p-space-lg lg:p-space-xl overflow-x-hidden">
        <Navigation />
        <Outlet />
        <footer className="w-full mt-space-xl pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-text-muted font-body-sm text-body-sm">
          <div className="text-center sm:text-left">
            © 2025 ArogyaNet National Public Health Resilience Infrastructure. All rights reserved.
          </div>
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-healthy"></span> Telemetry Active
            </span>
            <span>District Grid Status: Synced</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
