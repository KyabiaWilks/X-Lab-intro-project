// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `chatroom_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    password: varchar("password", { length: 256 }),
    isAdmin: boolean("is_admin").default(false) // 添加isAdmin字段
  }
);

export const messages = createTable(
  "message",
  {
    messageId: serial("message_id").primaryKey(),
    roomId: integer("room_id").notNull(),
    sender: varchar("sender", { length: 256 }).notNull(),
    content: varchar("content", { length: 1024 }).notNull(),
    time: timestamp("time", { withTimezone: true }).notNull(),
  }
);

export const rooms = createTable(
  "room",
  {
    roomId: serial("room_id").primaryKey(),
    roomName: varchar("room_name", { length: 256 }).notNull(),
    lastMessageId: integer("last_message_id"), // Nullable foreign key referencing `message`
  }
);