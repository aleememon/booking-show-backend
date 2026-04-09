import type { Request, Response } from "express";
import { db } from "../../common/config/db/index.js";
import { bookingsTables } from "../../common/config/db/bookingSchema.js";
import { and, eq, sql } from "drizzle-orm";
import APIResponse from "../../common/utils/api-response.js";

export const handleSeats = async (req: Request, res: Response) => {
  try {
    await db.execute(sql`
            INSERT INTO ${bookingsTables} ("name", "isBooked")
            SELECT 'Seat ' || gs, 0 FROM generate_series(1, 20) AS gs
            `);
    return APIResponse.created(res, "20 seats generated");
  } catch (err) {
    return res.status(400).json({ message: "Seeding failed", error: err });
  }
};

export const getAllSeats = async (req: Request, res: Response) => {
  try {
    const allSeats = await db.select().from(bookingsTables);

    return APIResponse.ok(res, "All seats", allSeats);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const seatBooking = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const name = req.params.name as string;

  if (!id || !name) {
    return res.status(400).json({ error: "Missing ID or Name" });
  }

  try {
    const result = await db.transaction(async (tx) => {
      const rows = await tx
        .select()
        .from(bookingsTables)
        .where(and(eq(bookingsTables.id, id), eq(bookingsTables.isBooked, 0)))
        .for("update");

      if (rows.length === 0) {
        throw new Error("Seat already booked"); // in drizzle throwing an error means ROLLBACK inside TRANSACTION
      }

      const updated = await tx
        .update(bookingsTables)
        .set({ isBooked: 1, name: name })
        .where(eq(bookingsTables.id, id))
        .returning();

      return updated[0];
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
