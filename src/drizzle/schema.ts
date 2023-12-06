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
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const profile = pgTable("profile", {
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
  channels: many(channel),
}));

export const server = pgTable("server", {
  id: serial("id").primaryKey(),
  name: text("name"),
  imageUrl: text("imageUrl"),
  inviteCode: text("inviteCode"),
  userId: integer("user_id").references(() => profile.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const serverRelations = relations(server, ({ one, many }) => ({
  profile: one(profile, {
    fields: [server.userId],
    references: [profile.userId],
  }),
  members: many(member),
  channel: many(channel),
}));

export const memberRole = pgEnum("memberRole", ["Admin", "Moderator", "Guest"]);

export const member = pgTable("member", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => profile.id),
  role: memberRole("Guest"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const memberRelations = relations(member, ({ one, many }) => ({
  profile: one(profile, {
    fields: [member.userId],
    references: [profile.userId],
  }),
  server: one(server, {
    fields: [member.userId],
    references: [server.id],
  }),
  messages: many(message),
  directMessages: many(directMessage),
}));

export const membersToServer = pgTable("members_to_server", {
  memberId: integer("member_id")
    .notNull()
    .references(() => member.id),
  serverId: integer("server_id")
    .notNull()
    .references(() => server.id),
});

export const membersToServerRelation = relations(
  membersToServer,
  ({ one }) => ({
    server: one(server, {
      fields: [membersToServer.serverId],
      references: [server.id],
    }),
    member: one(member, {
      fields: [membersToServer.memberId],
      references: [member.userId],
    }),
  })
);

export const channelType = pgEnum("channelType", ["Text", "Audio", "Video"]);

export const channel = pgTable("channel", {
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

export const message = pgTable("message", {
  id: serial("id").primaryKey(),
  content: text("content"),
  fileUrl: text("fileUrl"),
  memberId: integer("member_id").references(() => member.id),
  channelId: integer("channel_id").references(() => channel.id),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messageRelations = relations(message, ({ one }) => ({
  member: one(member, {
    fields: [message.id],
    references: [member.id],
  }),
  message: one(channel, {
    fields: [message.id],
    references: [channel.id],
  }),
}));

export const conversation = pgTable("conversation", {
  id: serial("id").primaryKey(),
  memberOne: serial("memberOne_id"),
  memberTwo: serial("memberTwo_id"),
  content: text("content"),
  fileUrl: text("fileUrl"),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const conversationRelation = relations(
  conversation,
  ({ one, many }) => ({
    conversationInitiated: one(conversation, {
      fields: [conversation.memberOne],
      references: [conversation.id],
      relationName: "memberOne",
    }),
    conversationRelation: one(conversation, {
      fields: [conversation.memberTwo],
      references: [conversation.id],
      relationName: "memberTwo",
    }),
    directMessages: many(directMessage),
  })
);

export const directMessage = pgTable("directMessage", {
  id: serial("id").primaryKey(),
  content: text("content"),
  fileUrl: text("fileUrl"),
  memberId: integer("member_id").references(() => member.id),
  conversationId: integer("conversation_id").references(() => conversation.id),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const directMessageRelations = relations(directMessage, ({ one }) => ({
  member: one(member, {
    fields: [directMessage.id],
    references: [member.id],
  }),
  conversation: one(conversation, {
    fields: [directMessage.id],
    references: [conversation.id],
  }),
}));
