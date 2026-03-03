import mongoose from "mongoose";
import { SSData, Address, SanghData } from "@/models/sangha";
import { NextResponse } from "next/server";

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Received form data:", body);

    /* =========================
       🔴 1️⃣ BACKEND VALIDATION
    ========================== */

    // Required field validation
    if (
      !body.name ||
      !body.phone ||
      !body.vibhag ||
      !body.nagar ||
      !body.milan
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Phone number validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Duplicate phone check
    const existingUser = await SSData.findOne({ phone: body.phone });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Phone number already registered" },
        { status: 409 }
      );
    }

    /* =========================
       2️⃣ SAVE ADDRESS
    ========================== */

    const address = await Address.create({
      address: body.building,
      address2: body.street,
      address3: body.poBox,
      pincode: body.pincode,
      upavasati: body.upavasati,
      location: body.locationUrl || "",
    });

    /* =========================
       3️⃣ SAVE PERSONAL DATA
    ========================== */

    const ssData = await SSData.create({
      name: body.name,
      phone: body.phone,
      email: body.email,
      bloodGroup: body.bloodGroup,
      education: body.education,
      otherEducation: body.otherEducation,
      profession: body.profession,
      otherProfession: body.otherProfession,
      job: body.workDetails,
      dob: body.dob,
      currentAddress: address._id,
    });

    /* =========================
       4️⃣ SAVE SANGH DATA
    ========================== */

    const sanghData = await SanghData.create({
      shakhe: body.milan,
      vibhag: body.vibhag,
      bhag: body.bhag,
      nagar: body.nagar,
      vasati: body.vasati,
      upavasati: body.upavasati,
      sanghaResponsibility: body.sanghaJavabdhari,
      sanghOrganization: body.sanghOrganizationName,
      otherResponsibility: body.otherResponsibility,
      sanghShikshan: body.sanghaShikshana,
      ssData: ssData._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
        data: sanghData,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("Error saving form:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Server error. Please try again later.",
        error: err.message,
      },
      { status: 500 }
    );
  }
}