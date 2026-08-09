import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

// TanStack Start (SSR framework) expects window.__TSR_DEHYDRATED__ to exist
// when SSR=true is registered in the routeTree. On GitHub Pages (static hosting),
// no server renders HTML, so we inject a minimal empty payload to prevent the
// "Invariant failed" error and let the client router start fresh.
if (typeof window !== "undefined" && !window.__TSR_DEHYDRATED__) {
  // @ts-expect-error – required runtime shim for TanStack Start client-only mode
  window.__TSR_DEHYDRATED__ = { dehydrated: { router: null, ctx: {} } };
}

const router = getRouter();

// Manually trigger client-side hydration/start
router.load().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
});
