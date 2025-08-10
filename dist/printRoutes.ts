// scripts/printRoutes.ts
import { appRouter } from "E:/cback/demo/X-Lab-intro-project/src/server/api/root";
import { AnyRouter } from "@trpc/server";

function printRoutes(router: AnyRouter, prefix = ''): void {
  const record = router._def?.record;
  if (!record) return;

  for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'object' && value !== null && '_def' in value) {
        console.log(`${prefix}${key}`);
        printRoutes(value as AnyRouter, `${prefix}${key}/`);
      }
  }
}

printRoutes(appRouter);
