import { relations } from "drizzle-orm";
import {
pgTable,   
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  integer,
  date
} from "drizzle-orm/pg-core";

export const account = pgTable(
  "account",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    userId: varchar("user_id", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 191,
    }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 191 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (account) => ({
    providerIndex: uniqueIndex("provider_idx").on(
      account.provider,
      account.providerAccountId
    ),
  })
);

export const session = pgTable(
  "session",
  {
    userId: varchar("user_id", { length: 191 }).notNull(),
    expires: date("expires").notNull(),
    sessionToken: varchar("session_token", { length: 191 }).notNull(),
  },
  (session) => ({
    sessionTokenIndex: primaryKey(session.sessionToken),
  })
);

export const verificationToken = pgTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: date("expires").notNull(),
  },
  (request) => ({
    identifierTokenIndex: uniqueIndex("identifier_token_idx").on(
      request.identifier,
      request.token
    ),
  })
);

export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),
    emailVerified: timestamp("email_verified"),
    image: varchar("image", { length: 191 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (user) => ({
    emailIndex: uniqueIndex("email_idx").on(user.email),
  })
);

export const userRelations = relations(user, ({ many, one }) => ({
  account: many(account),
  session: many(session),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));