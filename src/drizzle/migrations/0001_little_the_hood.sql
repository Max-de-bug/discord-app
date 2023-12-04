CREATE SCHEMA "my_schema";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "channelType" AS ENUM('Text', 'Audio', 'Video');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "memberRole" AS ENUM('Admin', 'Moderator', 'Guest');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_schema"."channel" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"Text" "channelType",
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_schema"."conversation" (
	"id" serial PRIMARY KEY NOT NULL,
	"memberOne_id" serial NOT NULL,
	"memeberTwo_id" serial NOT NULL,
	"content" text,
	"fileUrl" text,
	"deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "conversation_memberOne_id_unique" UNIQUE("memberOne_id"),
	CONSTRAINT "conversation_memeberTwo_id_unique" UNIQUE("memeberTwo_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_schema"."directMessage" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"fileUrl" text,
	"member_id" integer,
	"conversation_id" integer,
	"deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_schema"."member" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"memberOne" integer,
	"memberTwo" integer,
	"Guest" "memberRole",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_schema"."message" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"fileUrl" text,
	"member_id" integer,
	"channel_id" integer,
	"deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_schema"."profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"username" text,
	"email" text,
	"password" text,
	"imageUrl" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "profile_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_schema"."server" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"imageUrl" text,
	"inviteCode" text,
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "pg_stat_statements_info";--> statement-breakpoint
DROP TABLE "pg_stat_statements";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_schema"."channel" ADD CONSTRAINT "channel_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "my_schema"."profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_schema"."directMessage" ADD CONSTRAINT "directMessage_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "my_schema"."member"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_schema"."directMessage" ADD CONSTRAINT "directMessage_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "my_schema"."conversation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_schema"."member" ADD CONSTRAINT "member_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "my_schema"."profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_schema"."member" ADD CONSTRAINT "member_memberOne_conversation_memberOne_id_fk" FOREIGN KEY ("memberOne") REFERENCES "my_schema"."conversation"("memberOne_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_schema"."member" ADD CONSTRAINT "member_memberTwo_conversation_memeberTwo_id_fk" FOREIGN KEY ("memberTwo") REFERENCES "my_schema"."conversation"("memeberTwo_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_schema"."message" ADD CONSTRAINT "message_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "my_schema"."member"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_schema"."message" ADD CONSTRAINT "message_channel_id_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "my_schema"."channel"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "my_schema"."server" ADD CONSTRAINT "server_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "my_schema"."profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
