import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";


export const bookingsTables = pgTable("bookings", {
    id: uuid().defaultRandom(),
    name: varchar("name", {length: 255}),
    isBooked: integer().default(0)
});