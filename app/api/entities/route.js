import mongoose from "mongoose";
import models from "@/models/sangha";
import { NextResponse } from "next/server";

const { Entity, Sthara } = models;

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const stharaName = searchParams.get("sthara");

    if (!stharaName) {
      return NextResponse.json([]);
    }

    const sthara = await Sthara.findOne({ name: stharaName });

    if (!sthara) {
      return NextResponse.json([]);
    }

    const entities = await Entity.find({ sthara: sthara._id })
      .select("name");

    return NextResponse.json(entities);
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}