import { QueryClient } from "@tanstack/react-query";
import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreloadStaleTime: 0,
    history: createHashHistory(),
    // Disable TanStack Start's SSR dehydration/hydration lifecycle:
    // these no-ops prevent "Invariant failed" on GitHub Pages static hosting.
    dehydrate: () => ({}),
    hydrate: () => {},
  });

  return router;
};
