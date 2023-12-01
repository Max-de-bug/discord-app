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
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  userId: integer("id").unique(),
  name: text("name"),
  imageUrl: text("imageUrl"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profileRelations = relations(profile, ({ many }) => ({
  servers: many(server),
  members: many(member),
  channel: many(channel),
}));

export const server = pgTable("server", {
  id: serial("id").primaryKey(),
  name: text("name"),
  imageUrl: text("imageUrl"),
  inviteCode: text("inviteCode"),
  userId: integer("id").references(() => profile.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const serverRelations = relations(server, ({ many }) => ({
  members: many(member),
  channel: many(channel),
}));

export const memberRole = pgEnum("memberRole", ["Admin", "Moderator", "Guest"]);

export const member = pgTable("member", {
  id: serial("id").primaryKey(),
  userId: integer("user_Id"),
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
}));
export const channelType = pgEnum("channelType", ["Text", "Audio", "Video"]);

export const channel = pgTable("channel", {
  id: serial("id").primaryKey(),
  name: text("name"),
  type: channelType("Text"),
  userId: integer("user_Id"),
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
}));
