import mongoose from "mongoose";
import models from "@/models/sangha";
import { NextResponse } from "next/server";

const { Entity, Sthara, ParentEntity } = models;

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const stharaName = searchParams.get("sthara");
    const parentId = searchParams.get("parent");

    if (!stharaName) return NextResponse.json([]);

    
    const sthara = await Sthara.findOne({ name: stharaName });
    if (!sthara) return NextResponse.json([]);

    let query = { sthara: sthara._id };

    
    if (parentId) {
      const relations = await ParentEntity.find({
        parentEntity: parentId,
      });

      const childIds = relations.map((rel) => rel.currentEntity);

      
      if (childIds.length === 0) {
        return NextResponse.json([]);
      }

      query._id = { $in: childIds };
    }

    
    const entities = await Entity.find(query).select("name");

    return NextResponse.json(entities);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}