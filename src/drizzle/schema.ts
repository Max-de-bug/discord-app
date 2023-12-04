import {
  pgTable,
  bigint,
  timestamp,
  boolean,
  text,
  doublePrecision,
  numeric,
  serial,
  integer,
  date,
  pgEnum,
  uuid,
  pgSchema,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const mySchema = pgSchema("my_schema");

export const profile = mySchema.table("profile", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").unique(),
  username: text("username").unique(),
  email: text("email"),
  password: text("password"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profileRelations = relations(profile, ({ many }) => ({
  servers: many(server),
  members: many(member),
  channel: many(channel),
}));

export const server = mySchema.table("server", {
  id: serial("id").primaryKey(),
  name: text("name"),
  imageUrl: text("imageUrl"),
  inviteCode: text("inviteCode"),
  userId: integer("user_id").references(() => profile.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const serverRelations = relations(server, ({ many }) => ({
  members: many(member),
  channel: many(channel),
}));

export const memberRole = pgEnum("memberRole", ["Admin", "Moderator", "Guest"]);

export const member = mySchema.table("member", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => profile.id),
  conversationInitiated: integer("memberOne").references(
    () => conversation.memberOne
  ),
  conversationReceived: integer("memberTwo").references(
    () => conversation.memberTwo
  ),
  role: memberRole("Guest"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const memberRelations = relations(member, ({ one, many }) => ({
  profile: one(profile, {
    fields: [member.userId],
    references: [profile.id],
  }),
  servers: many(server),
  messages: many(message),
  directMessages: many(directMessage),
}));
export const channelType = pgEnum("channelType", ["Text", "Audio", "Video"]);

export const channel = mySchema.table("channel", {
  id: serial("id").primaryKey(),
  name: text("name"),
  type: channelType("Text"),
  userId: integer("user_id").references(() => profile.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const channelRelations = relations(channel, ({ one, many }) => ({
  profile: one(profile, {
    fields: [channel.userId],
    references: [profile.id],
  }),
  server: one(server, {
    fields: [channel.userId],
    references: [server.id],
  }),
  message: many(message),
}));

export const message = mySchema.table("message", {
  id: serial("id").primaryKey(),
  content: text("content"),
  fileUrl: text("fileUrl"),
  memberId: integer("member_id").references(() => member.id),
  channelId: integer("channel_id").references(() => channel.id),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conversation = mySchema.table("conversation", {
  id: serial("id").primaryKey(),
  memberOne: serial("memberOne_id").unique(),
  memberTwo: serial("memeberTwo_id").unique(),
  content: text("content"),
  fileUrl: text("fileUrl"),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const conversationRelation = relations(
  conversation,
  ({ one, many }) => ({
    directMessages: many(directMessage),
  })
);

export const directMessage = mySchema.table("directMessage", {
  id: serial("id").primaryKey(),
  content: text("content"),
  fileUrl: text("fileUrl"),
  memberId: integer("member_id").references(() => member.id),
  conversationId: integer("conversation_id").references(() => conversation.id),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
