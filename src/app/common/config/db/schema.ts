import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),

    firstName: varchar("first_name", {length: 100}).notNull(),
    lastName: varchar("last_name", {length: 100}),

    email: varchar("email", {length: 322}).notNull().unique(),
    isVerified: boolean("is_verified").default(false).notNull(),

    password: varchar("password", { length: 66}).notNull(),
    salt: text(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
});