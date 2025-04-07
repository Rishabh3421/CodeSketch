import { integer, pgTable, varchar, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer().default(10)
});

export const CodeSketch = pgTable("code-sketch", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uid: varchar().notNull(),
    imageURL: varchar(),
    model: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    createdBy: varchar(),
    code: json()
});
