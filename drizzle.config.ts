import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "E:/cback/demo/X-Lab-intro-project/src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["chatroom_*"],
} satisfies Config;
