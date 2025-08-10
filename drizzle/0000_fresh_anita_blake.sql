CREATE TABLE "chatroom_message" (
	"message_id" serial PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"sender" varchar(256) NOT NULL,
	"content" varchar(1024) NOT NULL,
	"time" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chatroom_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "chatroom_room" (
	"room_id" serial PRIMARY KEY NOT NULL,
	"room_name" varchar(256) NOT NULL,
	"last_message_id" integer
);
--> statement-breakpoint
CREATE TABLE "chatroom_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"password" varchar(256),
	"is_admin" boolean DEFAULT false
);
--> statement-breakpoint
CREATE INDEX "name_idx" ON "chatroom_post" USING btree ("name");