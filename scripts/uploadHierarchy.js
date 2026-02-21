import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";
import models from "../models/sangha.js";

dotenv.config({ path: ".env.local" });

const { Sthara, Entity, ParentEntity } = models;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("DB Connection Error:", err);
    process.exit(1);
  }
}

async function upload() {
  await connectDB();

  console.log("Reading Excel file...");
  const workbook = xlsx.readFile("./data/data.xlsx");
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);
  console.log("📊 Total Rows Found:", rows.length);

  // -----------------------------
  // 1️⃣ Load caches
  // -----------------------------
  const stharaNames = ["Vibhag", "Bhaga", "Taluku", "Mandala", "Grama"];
  const stharaCache = {};
  const entityCache = {}; // key = `${name}_${stharaId}`

  // Load existing Stharas
  const existingSthara = await Sthara.find({ name: { $in: stharaNames } });
  existingSthara.forEach((s) => (stharaCache[s.name] = s));

  // Create missing Stharas
  const missingStharaNames = stharaNames.filter((name) => !stharaCache[name]);
  if (missingStharaNames.length > 0) {
    const newStharas = await Sthara.insertMany(
      missingStharaNames.map((name) => ({ name }))
    );
    newStharas.forEach((s) => (stharaCache[s.name] = s));
  }

  // Preload existing entities
  const entities = await Entity.find({});
  entities.forEach((e) => {
    const key = `${e.name}_${e.sthara}`;
    entityCache[key] = e;
  });

  // -----------------------------
  // 2️⃣ Prepare bulk inserts
  // -----------------------------
  const newEntities = [];
  const parentLinksSet = new Set();

  rows.forEach((row, idx) => {
    const vibhag = row["Vibhaga"];
    const bhaga = row["Jilla / Bhag"];
    const taluku = row["Taluku / Nagara"];
    const mandala = row["Mandala / Vasati"];
    const grama = row["Grama / Upavasathi"];

    const stharas = {
      Vibhag: stharaCache["Vibhag"],
      Bhaga: stharaCache["Bhaga"],
      Taluku: stharaCache["Taluku"],
      Mandala: stharaCache["Mandala"],
      Grama: stharaCache["Grama"],
    };

    // Helper to get or create entity
    function getOrAddEntity(name, sthara) {
      if (!name) return null;
      const key = `${name}_${sthara._id}`;
      if (entityCache[key]) return entityCache[key];

      const newEntity = { name, sthara: sthara._id };
      newEntities.push(newEntity);
      entityCache[key] = newEntity; // temporarily store with _id undefined
      return newEntity;
    }

    const eVibhag = getOrAddEntity(vibhag, stharas.Vibhag);
    const eBhaga = getOrAddEntity(bhaga, stharas.Bhaga);
    const eTaluku = getOrAddEntity(taluku, stharas.Taluku);
    const eMandala = getOrAddEntity(mandala, stharas.Mandala);
    const eGrama = getOrAddEntity(grama, stharas.Grama);

    // Prepare parent links
    function addParent(child, parent) {
      if (!child || !parent) return;
      const key = `${child.name}_${parent.name}_${child.sthara}_${parent.sthara}`;
      parentLinksSet.add(key);
    }

    addParent(eBhaga, eVibhag);
    addParent(eTaluku, eBhaga);
    addParent(eMandala, eTaluku);
    addParent(eGrama, eMandala);

    if ((idx + 1) % 1000 === 0) console.log(`Processed ${idx + 1} rows`);
  });

  // -----------------------------
  // 3️⃣ Insert new entities
  // -----------------------------
  if (newEntities.length > 0) {
    const insertedEntities = await Entity.insertMany(newEntities, { ordered: false });
    insertedEntities.forEach((e) => {
      const key = `${e.name}_${e.sthara}`;
      entityCache[key] = e;
    });
  }

  // -----------------------------
  // 4️⃣ Insert ParentEntity links
  // -----------------------------
  const parentLinks = Array.from(parentLinksSet).map((key) => {
    const [childName, parentName, childStharaId, parentStharaId] = key.split("_");
    const child = entityCache[`${childName}_${childStharaId}`];
    const parent = entityCache[`${parentName}_${parentStharaId}`];
    return { currentEntity: child._id, parentEntity: parent._id };
  });

  if (parentLinks.length > 0) {
    await ParentEntity.insertMany(parentLinks, { ordered: false });
  }

  console.log("✅ Hierarchy uploaded successfully!");
  process.exit();
}

upload();