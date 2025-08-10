"use strict";
// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = exports.messages = exports.users = exports.posts = exports.createTable = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
exports.createTable = (0, pg_core_1.pgTableCreator)(function (name) { return "chatroom_".concat(name); });
exports.posts = (0, exports.createTable)("post", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .default((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CURRENT_TIMESTAMP"], ["CURRENT_TIMESTAMP"]))))
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).$onUpdate(function () { return new Date(); }),
}, function (example) { return ({
    nameIndex: (0, pg_core_1.index)("name_idx").on(example.name),
}); });
exports.users = (0, exports.createTable)("user", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }),
    password: (0, pg_core_1.varchar)("password", { length: 256 })
});
exports.messages = (0, exports.createTable)("message", {
    messageId: (0, pg_core_1.serial)("message_id").primaryKey(),
    roomId: (0, pg_core_1.integer)("room_id").notNull(),
    sender: (0, pg_core_1.varchar)("sender", { length: 256 }).notNull(),
    content: (0, pg_core_1.varchar)("content", { length: 1024 }).notNull(),
    time: (0, pg_core_1.timestamp)("time", { withTimezone: true }).notNull(),
});
exports.rooms = (0, exports.createTable)("room", {
    roomId: (0, pg_core_1.serial)("room_id").primaryKey(),
    roomName: (0, pg_core_1.varchar)("room_name", { length: 256 }).notNull(),
    lastMessageId: (0, pg_core_1.integer)("last_message_id"), // Nullable foreign key referencing `message`
});
var templateObject_1;
