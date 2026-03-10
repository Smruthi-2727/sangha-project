import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";
import models from "../models/sangha.js";

dotenv.config({ path: ".env.local" });

const { Sthara, Entity, ParentEntity } = models;

async function run() {

  console.log("🚀 Starting Hierarchy Upload");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB Connected");

  // -----------------------------
  // Read Excel
  // -----------------------------

  const workbook = xlsx.readFile("./data/data.xlsx");
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  console.log("📊 Total rows:", rows.length);

  // -----------------------------
  // Load Stharas
  // -----------------------------

  const stharaNames = ["Vibhag", "Bhag", "Taluku", "Mandala", "Grama"];

  const stharas = {};
  const stharaDocs = await Sthara.find({ name: { $in: stharaNames } });

  stharaDocs.forEach((s) => {
    stharas[s.name] = s._id;
  });

  // -----------------------------
  // Caches
  // -----------------------------

  const entityCache = new Map();
  const entityInsert = [];
  const parentInsert = [];

  // -----------------------------
  // Normalize Function
  // -----------------------------

  function normalize(val) {

    if (!val) return null;

    const text = String(val).trim().toLowerCase();

    // Convert to Title Case
    return text
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getKey(name, sthara, parentId) {
    return `${name}_${sthara}_${parentId || "root"}`;
  }

  // -----------------------------
  // Entity Creator
  // -----------------------------

  function getEntity(name, sthara, parent) {

    if (!name) return null;

    const key = getKey(name, sthara, parent);

    if (entityCache.has(key)) {
      return entityCache.get(key);
    }

    const id = new mongoose.Types.ObjectId();

    const entity = {
      _id: id,
      name: name,
      sthara: sthara,
    };

    entityCache.set(key, id);
    entityInsert.push(entity);

    if (parent) {
      parentInsert.push({
        currentEntity: id,
        parentEntity: parent,
      });
    }

    return id;
  }

  // -----------------------------
  // Process Excel Rows
  // -----------------------------

  rows.forEach((row, index) => {

    const vibhag = normalize(row["Vibhaga"]);
    const bhag = normalize(row["Jilla / Bhag"]);
    const taluku = normalize(row["Taluku / Nagara"]);
    const mandala = normalize(row["Mandala / Vasati"]);
    const grama = normalize(row["Grama / Upavasathi"]);

    const eVibhag = getEntity(vibhag, stharas["Vibhag"], null);
    const eBhag = getEntity(bhag, stharas["Bhag"], eVibhag);
    const eTaluku = getEntity(taluku, stharas["Taluku"], eBhag);
    const eMandala = getEntity(mandala, stharas["Mandala"], eTaluku);
    const eGrama = getEntity(grama, stharas["Grama"], eMandala);

    if ((index + 1) % 2000 === 0) {
      console.log(`⚡ Processed ${index + 1} rows`);
    }

  });

  console.log("📦 Entities to insert:", entityInsert.length);
  console.log("📦 Parent relations:", parentInsert.length);

  // -----------------------------
  // Insert Data
  // -----------------------------

  if (entityInsert.length > 0) {
    await Entity.insertMany(entityInsert, { ordered: false });
  }

  if (parentInsert.length > 0) {
    await ParentEntity.insertMany(parentInsert, { ordered: false });
  }

  console.log("🎉 Upload Completed Successfully!");

  process.exit();
}

run();