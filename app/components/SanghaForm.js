"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import {
  Box,
  Button,
  Container,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function AddSSDetails() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    trigger,
    getValues,
    setValue,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      vibhag: "",
      bhag: "",
      nagar: "",
      vasati: "",
      upavasati: "",
      shakhe: "",
      sanghaResponsibility: "",
      otherResponsibility: "",
      sanghShikshan: "",
      name: "",
      phone: "",
      emailOption: "No",
      email: "",
      bloodgroup: "",
      dob: "",
      address1: "",
      address2: "",
      address3: "",
      pincode: "",
      locationUrl: "",
      education: "",
      otherEducation: "",
      profession: "",
      otherProfession: "",
      work: "",
    },
  });

  
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  
  const steps = [
    { 
      title: "ವಿಭಾಗ & ಸ್ಥಳ ಮಾಹಿತಿ / Location Info", 
      fields: ["vibhag", "bhag", "nagar", "vasati", "upavasati", "shakhe", "sanghaResponsibility", "otherResponsibility", "sanghShikshan"] 
    },
    { 
      title: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ / Personal Info", 
      fields: ["name", "phone", "emailOption", "email", "bloodgroup", "dob"] 
    },
    { 
      title: "ಠಿಕಾಣಿ ಮಾಹಿತಿ / Address Info", 
      fields: ["address1", "address2", "address3", "pincode", "locationUrl"] 
    },
    { 
      title: "ಶಿಕ್ಷಣ / Education", 
      fields: ["education", "otherEducation"] 
    },
    { 
      title: "ವೃತ್ತಿ / Profession", 
      fields: ["profession", "otherProfession", "work"] 
    }
  ];

  const stepMessages = [
  "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಘದ ಘಟಕದ ಮಾಹಿತಿಯನ್ನು ಸರಿಯಾಗಿ ಆಯ್ಕೆಮಾಡಿ. / Please select your Sangha organizational unit details correctly.",
  "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ. / Please enter your personal details correctly.",
  "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿಳಾಸ ಮತ್ತು ಸಂಪರ್ಕ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ. / Please enter your address and location details.",
  "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿದ್ಯಾಭ್ಯಾಸದ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ. / Please provide your education details.",
  "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೃತ್ತಿ ಅಥವಾ ಕೆಲಸದ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ. / Please provide your profession or work details."
];
  
  const currentStepFields = steps[currentStep]?.fields || [];

  const optionalFields = ["locationUrl", "email", "otherResponsibility", "otherEducation", "otherProfession", "work"];

  const isStepValid = currentStepFields.every((field) => {
    if (optionalFields.includes(field)) return true;
    const value = watch(field);
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.trim() !== "";
    return true;
  });

  const nextStep = async () => {
    const isValidStep = await trigger(currentStepFields);
    if (isValidStep) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  
  const selectedEmailOption = watch("emailOption");
  const selectedEducation = watch("education");
  const selectedProfession = watch("profession");
  const selectedSanghResponsibility = watch("sanghaResponsibility");
  const selectedVibhag = watch("vibhag");
  const selectedBhag = watch("bhag");
  const selectedNagar = watch("nagar");
  const selectedVasati = watch("vasati");

  
  const [vibhags, setVibhags] = useState([]);
  const [bhags, setBhags] = useState([]);
  const [nagars, setNagars] = useState([]);
  const [vasatis, setVasatis] = useState([]);
  const [upavasatis, setUpavasatis] = useState([]);

  
  useEffect(() => {
    async function loadVibhags() {
      try {
        const res = await fetch(`/api/entities?sthara=Vibhag`);
        const data = await res.json();
        setVibhags(data);
      } catch (error) {
        console.error("Error loading vibhags:", error);
      }
    }
    loadVibhags();
  }, []);

  
  useEffect(() => {
    if (!selectedVibhag) {
      setBhags([]);
      return;
    }
    async function loadBhags() {
      const res = await fetch(`/api/entities?sthara=Bhag&parent=${selectedVibhag}`);
      const data = await res.json();
      setBhags(data);
    }
    loadBhags();
  }, [selectedVibhag]);

  
  useEffect(() => {
    if (!selectedBhag) {
      setNagars([]);
      return;
    }
    async function loadNagars() {
      const res = await fetch(`/api/entities?sthara=Taluku&parent=${selectedBhag}`);
      const data = await res.json();
      setNagars(data);
    }
    loadNagars();
  }, [selectedBhag]);

  
  useEffect(() => {
    if (!selectedNagar) {
      setVasatis([]);
      return;
    }
    async function loadVasatis() {
      const res = await fetch(`/api/entities?sthara=Mandala&parent=${selectedNagar}`);
      const data = await res.json();
      setVasatis(data);
    }
    loadVasatis();
  }, [selectedNagar]);

  
  useEffect(() => {
    if (!selectedVasati) {
      setUpavasatis([]);
      return;
    }
    async function loadUpavasatis() {
      const res = await fetch(`/api/entities?sthara=Grama&parent=${selectedVasati}`);
      const data = await res.json();
      setUpavasatis(data);
    }
    loadUpavasatis();
  }, [selectedVasati]);

  const sanghaShikshana = [
    "ಪ್ರಾರಂಭಿಕ ವರ್ಗ / Prarambhik Varga",
    "ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಾ ವರ್ಗ / Prathamik Shiksha Varga",
    "ಸಂಘ ಶಿಕ್ಷಾ ವರ್ಗ / Sangha Shiksha Varga",
    "ಕಾರ್ಯಕರ್ತ ವಿಕಾಸ ವರ್ಗ - 1 / Karyakarta Vikas Varga - 1",
    "ಕಾರ್ಯಕರ್ತ ವಿಕಾಸ ವರ್ಗ - 2 / Karyakarta Vikas Varga - 2",
    "ಸಂಘ ಶಿಕ್ಷಾ ವರ್ಗ - ದ್ವಿತೀಯ / Sangha Shiksha Varga - Dvitiiya",
    "ಸಂಘ ಶಿಕ್ಷಾ ವರ್ಗ - ತೃತೀಯ / Sangha Shiksha Varga - Tritiiya",
    "ಇನ್ನೂ ಆಗಬೇಕಿದೆ / Yet to attend",
  ];

  const education = [
    "1 - 9 Standard",
    "10th Standard",
    "11th Standard / PUC 1st Year",
    "12th Standard / PUC 2nd Year",
    "Degree",
    "Post Graduation",
    "PhD",
    "Other",
  ];

  const profession = [
    "Student",
    "Teacher",
    "Engineer",
    "Doctor",
    "Lawyer",
    "Business",
    "Farmer",
    "ಪ್ರಚಾರಕ/Pracharaka",
    "Retired",
    "Other",
  ];

  const bloodgroup = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "ಗೊತ್ತಿಲ್ಲ / Unknown",
  ];

  const sanghResponsibility = [
    "ಸಂಘ ಜವಾಬ್ದಾರಿ/Sangha Responsibility",
    "ವಿವಿಧ ಕ್ಷೇತ್ರದ ಜವಾಬ್ದಾರಿ/Vividh Khsetra Responsibility",
    "ಸ್ವಯಂಸೇವಕ/Swayamsevak",
  ];

  const submitEventDetails = async (data) => {
    try {
      const formattedData = {
        vibhag: data.vibhag,
        bhag: data.bhag,
        nagar: data.nagar,
        vasati: data.vasati,
        upavasati: data.upavasati,
        milan: data.shakhe,
        name: data.name,
        phone: data.phone,
        email: data.email,
        building: data.address1,
        street: data.address2,
        poBox: data.address3,
        pincode: data.pincode,
        locationUrl: data.locationUrl,
        bloodGroup: data.bloodgroup,
        dob: data.dob ? new Date(data.dob).getFullYear() : null,
        education: data.education,
        otherEducation: data.otherEducation,
        profession: data.profession,
        otherProfession: data.otherProfession,
        sanghaShikshana: data.sanghShikshan,
        sanghaJavabdhari: data.sanghaResponsibility,
        sanghOrganizationName: data.sanghOrganizationName,
        otherResponsibility: data.otherResponsibility,
        workDetails: data.work,
      };

      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      const result = await res.json();
      if (result.success) {
        alert("Saved successfully");
        localStorage.removeItem('sanghFormData');
        reset();
        setCurrentStep(0);
      } else {
        alert("Error saving data");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      {/* BLUE HEADER */}
      <div style={{ background: "#1976D2", color: "white", padding: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: "600px", margin: "auto" }}>
          <div style={{ fontSize: "18px", fontWeight: "600" }}>ಸಂಘ ಪೋರಕ ಸಾಧನ</div>
          <div style={{ fontSize: "12px" }}>ನಮ್ಮ ನಡೆ ಗುರು ತತ್ವದೆಡೆ</div>
        </div>
      </div>

    
<div
  style={{
    textAlign: "center",
    marginTop: "12px",
    fontSize: "14px",
    color: "#555"
  }}
>
  {stepMessages[currentStep]}
</div>

      <Container maxWidth="md" sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ mt: 1, minWidth: 300, maxWidth: 600, width: "100%" }}>

          {/* STEP 1: Location + Responsibility + SanghShikshan */}
          {currentStep === 0 && (
            <>
              <InputLabel id="vibhag-label" required>ವಿಭಾಗ/Vibhag</InputLabel>
              <Controller
                name="vibhag"
                control={control}
                rules={{ required: "ನಿಮ್ಮ ವಿಭಾಗ ಆಯ್ಕೆ ಮಾಡಿ / Please select your Vibhag." }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select 
                      {...field}
                      id="vibhag" 
                      labelId="vibhag-label"
                      variant="standard" 
                      style={{ width: "100%" }} 
                      sx={{ m: 1 }}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select Vibhag</em></MenuItem>
                      {vibhags?.map((v) => (
                        <MenuItem key={v._id} value={v._id}>{v.name}</MenuItem>
                      ))}
                    </Select>
                    <div style={{ fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                      {errors.vibhag?.message}
                    </div>
                  </>
                )}
              />

              <InputLabel id="bhag-label" required>ಜಿಲ್ಲಾ/ಭಾಗ/Bhag</InputLabel>
              <Controller
                name="bhag"
                control={control}
                rules={{ required: "ನಿಮ್ಮ ಭಾಗ/ಜಿಲ್ಲಾ ಆಯ್ಕೆ ಮಾಡಿ / Please select your Bhag/Jilla." }}
                render={({ field }) => (
                  <>
                    <Select 
                      {...field}
                      id="bhag" 
                      labelId="bhag-label"
                      variant="standard" 
                      disabled={!selectedVibhag}
                      style={{ width: "100%" }} 
                      sx={{ m: 1 }}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select Bhag</em></MenuItem>
                      {bhags?.map((b) => (
                        <MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>
                      ))}
                    </Select>
                    <div style={{ fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                      {errors.bhag?.message}
                    </div>
                  </>
                )}
              />

              <InputLabel id="nagar-label" required>ತಾಲ್ಲೂಕ/ನಗರ/Nagar</InputLabel>
              <Controller
                name="nagar"
                control={control}
                rules={{ required: "ನಿಮ್ಮ ನಗರ/ತಾಲ್ಲೂಕ ಆಯ್ಕೆ ಮಾಡಿ/Please select Nagar/Talluka." }}
                render={({ field }) => (
                  <>
                    <Select 
                      {...field}
                      id="nagar" 
                      labelId="nagar-label"
                      variant="standard" 
                      disabled={!selectedBhag}
                      style={{ width: "100%" }} 
                      sx={{ m: 1 }}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select Nagar</em></MenuItem>
                      {nagars?.map((n) => (
                        <MenuItem key={n._id} value={n._id}>{n.name}</MenuItem>
                      ))}
                    </Select>
                    <div style={{ fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                      {errors.nagar?.message}
                    </div>
                  </>
                )}
              />

              <InputLabel id="vasati-label" required>ವಸತಿ/ಮಂಡಲ/Vasati</InputLabel>
              <Controller
                name="vasati"
                control={control}
                rules={{ required: "ನಿಮ್ಮ ಮಂಡಲ/ವಸತಿ ಆಯ್ಕೆ ಮಾಡಿ. / Please select your Mandala/Vasati." }}
                render={({ field }) => (
                  <>
                    <Select 
                      {...field}
                      id="vasati" 
                      labelId="vasati-label"
                      variant="standard" 
                      disabled={!selectedNagar}
                      style={{ width: "100%" }} 
                      sx={{ m: 1 }}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select Vasati</em></MenuItem>
                      {vasatis?.map((v) => (
                        <MenuItem key={v._id} value={v._id}>{v.name}</MenuItem>
                      ))}
                    </Select>
                    <div style={{ fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                      {errors.vasati?.message}
                    </div>
                  </>
                )}
              />

              <InputLabel id="upavasati-label" required>ಗ್ರಾಮ/ಉಪವಸತಿ/Upavasati</InputLabel>
              <Controller
                name="upavasati"
                control={control}
                rules={{ required: "ನಿಮ್ಮ ಗ್ರಾಮ/ಉಪವಸತಿ ಆಯ್ಕೆ ಮಾಡಿ. / Please select your Grama/Upavasati." }}
                render={({ field }) => (
                  <>
                    <Select 
                      {...field}
                      id="upavasati" 
                      labelId="upavasati-label"
                      variant="standard" 
                      disabled={!selectedVasati}
                      style={{ width: "100%" }} 
                      sx={{ m: 1 }}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select Upavasati</em></MenuItem>
                      {upavasatis?.map((u) => (
                        <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
                      ))}
                    </Select>
                    <div style={{ fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                      {errors.upavasati?.message}
                    </div>
                  </>
                )}
              />

              <InputLabel id="shakhe-label" required>ಶಾಖೆ/ಮಿಲನ/Shakhe/Milan</InputLabel>
              <TextField 
                id="shakhe" 
                variant="standard" 
                sx={{ m: 1 }} 
                style={{ width: "100%" }} 
                placeholder="ನಿಮ್ಮ ಹತ್ತಿರದ ಶಾಖೆ/ಮಿಲನ ಹೆಸರು. / Nearest shakhe or Milan name." 
                {...register("shakhe", { required: "ಶಾಖೆ/ಮಿಲನ ಹೆಸರು ತಿಳಿಸಿ." })} 
              />
              <div style={{ fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                {errors.shakhe?.message}
              </div>
<InputLabel id="responsibility-label" required>
  ಸಂಘದ ಜವಾಬ್ದಾರಿ / Responsibility
</InputLabel>
<Controller
  name="sanghaResponsibility"
  control={control}
  rules={{
    required:
      "ಸಂಘದ ಜವಾಬ್ದಾರಿ ಆಯ್ಕೆ ಮಾಡಿ. / Select your responsibility in Sangha.",
  }}
  render={({ field }) => (
    <>
      <Select
        {...field}
        id="sanghaResponsibility"
        labelId="responsibility-label"
        variant="standard"
        sx={{ m: 2 }}
        style={{ width: "100%" }}
        displayEmpty
      >
        <MenuItem value="">
          <em>Select Responsibility</em>
        </MenuItem>
        {sanghResponsibility.map((p, index) => (
          <MenuItem key={index} value={p}>
            {p}
          </MenuItem>
        ))}
      </Select>
      <div
        style={{
          fontSize: "0.8rem",
          color: "red",
          marginLeft: "16px",
        }}
      >
        {errors.sanghaResponsibility?.message}
      </div>
    </>
  )}
/>

{/* Conditional Fields */}
{selectedSanghResponsibility ===
"ವಿವಿಧ ಕ್ಷೇತ್ರದ ಜವಾಬ್ದಾರಿ/Vividh Khsetra Responsibility" && (
  <>
    <TextField
      sx={{ m: 2 }}
      variant="standard"
      label="ಸಂಘಟನೆಯ ಹೆಸರು / Organization Name"
      style={{ width: "100%" }}
      {...register("sanghOrganizationName", {
        required: "ಸಂಘಟನೆಯ ಹೆಸರು ತಿಳಿಸಿ / Please specify organization name.",
      })}
    />
    <div
      style={{
        width: "100%",
        fontSize: "0.8rem",
        color: "red",
        marginLeft: "16px",
      }}
    >
      {errors.sanghOrganizationName?.message}
    </div>

    <TextField
      sx={{ m: 2 }}
      variant="standard"
      label="ನಿಮ್ಮ ಜವಾಬ್ದಾರಿಯನ್ನು ತಿಳಿಸಿ / Please specify your responsibility"
      style={{ width: "100%" }}
      {...register("otherResponsibility", {
        required:
          "ಸಂಘದಲ್ಲಿ ನಿಮ್ಮ ಜವಾಬ್ದಾರಿಯನ್ನು ತಿಳಿಸಿ / Please specify your responsibility.",
      })}
    />
    <div
      style={{
        width: "100%",
        fontSize: "0.8rem",
        color: "red",
        marginLeft: "16px",
      }}
    >
      {errors.otherResponsibility?.message}
    </div>
  </>
)}

{selectedSanghResponsibility &&
selectedSanghResponsibility !==
"ಸ್ವಯಂಸೇವಕ/Swayamsevak" &&
selectedSanghResponsibility !==
"ವಿವಿಧ ಕ್ಷೇತ್ರದ ಜವಾಬ್ದಾರಿ/Vividh Khsetra Responsibility" && (
  <>
    <TextField
      sx={{ m: 2 }}
      variant="standard"
      label="ನಿಮ್ಮ ಜವಾಬ್ದಾರಿಯನ್ನು ತಿಳಿಸಿ / Please specify your responsibility"
      style={{ width: "100%" }}
      {...register("otherResponsibility", {
        required:
          "ಸಂಘದಲ್ಲಿ ನಿಮ್ಮ ಜವಾಬ್ದಾರಿಯನ್ನು ತಿಳಿಸಿ / Please specify your responsibility.",
      })}
    />
    <div
      style={{
        width: "100%",
        fontSize: "0.8rem",
        color: "red",
        marginLeft: "16px",
      }}
    >
      {errors.otherResponsibility?.message}
    </div>
  </>
)}

              <InputLabel id="sangh-label" required>ಸಂಘದ ಶಿಕ್ಷಣ/Sangha Shikshana</InputLabel>
              <Controller
                name="sanghShikshan"
                control={control}
                rules={{ required: "ಸಂಘದ ಶಿಕ್ಷಣ ಮಾಹಿತಿ ತಿಳಿಸಿ. / Please select a Sangha Shikshana." }}
                render={({ field }) => (
                  <>
                    <Select 
                      {...field}
                      id="sanghShikshan" 
                      labelId="sangh-label"
                      variant="standard" 
                      sx={{ m: 1 }} 
                      style={{ width: "100%" }}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select Sangha Shikshana</em></MenuItem>
                      {sanghaShikshana.map((ss, index) => (
                        <MenuItem key={index} value={ss}>{ss}</MenuItem>
                      ))}
                    </Select>
                    <div style={{ fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                      {errors.sanghShikshan?.message}
                    </div>
                  </>
                )}
              />
            </>
          )}

          {/* STEP 2: Personal Info */}
          {currentStep === 1 && (
            <>
              <TextField 
                sx={{ m: 2 }} 
                variant="standard" 
                label="ಹೆಸರು/Name" 
                style={{ width: "100%" }} 
                {...register("name", { required: "ನಿಮ್ಮ ಹೆಸರು ತಿಳಿಸಿ. / Please enter your name." })} 
              />
              <div style={{ width: "100%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                {errors.name?.message}
              </div>

              <TextField 
                sx={{ m: 2 }} 
                variant="standard" 
                label="10 ಅಂಕಿಯ ದೂರವಾಣಿ ಸಂಖ್ಯೆ/10 digit Phone number" 
                type="tel" 
                style={{ width: "100%" }} 
                {...register("phone", { 
                  required: "ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ತಿಳಿಸಿ. / Please enter your 10 digit phone number.",
                  pattern: { 
                    value: /^[0-9]{10}$/, 
                    message: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 10 ಅಂಕಿಯ ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು / Phone number must be exactly 10 digits." 
                  } 
                })} 
              />
              <div style={{ width: "100%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                {errors.phone?.message}
              </div>

              <Controller
                name="emailOption"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field} sx={{ m: 2 }}>
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="ಇಮೇಲ್ ಐಡಿ ಇಲ್ಲ / I don't have email id"
                    />
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="ಇಮೇಲ್ ಐಡಿ ಇದೆ / I have email ID"
                    />
                  </RadioGroup>
                )}
              />

              {selectedEmailOption === "Yes" && (
                <>
                  <TextField
                    sx={{ m: 2 }}
                    variant="standard"
                    label="ಇಮೇಲ್/email"
                    style={{ width: "100%" }}
                    {...register("email", {
                      required: "ಇಮೇಲ್ id ತಿಳಿಸಿ.",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address.",
                      },
                    })}
                  />
                  <div style={{ width: "100%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                    {errors.email?.message}
                  </div>
                </>
              )}

              <InputLabel id="bloodgroup-label" required>ರಕ್ತದ ಗುಂಪು/Blood Group</InputLabel>
              <Controller
                name="bloodgroup"
                control={control}
                rules={{ required: "ನಿಮ್ಮ ರಕ್ತದ ಗುಂಪು ಯಾವುದೆಂದು ತಿಳಿಸಿ." }}
                render={({ field }) => (
                  <>
                    <Select 
                      {...field}
                      id="bloodgroup" 
                      labelId="bloodgroup-label"
                      variant="standard" 
                      sx={{ m: 2 }} 
                      style={{ width: "100%" }}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select Blood Group</em></MenuItem>
                      {bloodgroup.map((bg, index) => (
                        <MenuItem key={index} value={bg}>{bg}</MenuItem>
                      ))}
                    </Select>
                    <div style={{ fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                      {errors.bloodgroup?.message}
                    </div>
                  </>
                )}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="dob"
                  control={control}
                  rules={{
                    required: "ನೀವು ಹುಟ್ಟಿದ ವರ್ಷ ತಿಳಿಸಿ. / Please select your year of birth.",
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="ಹುಟ್ಟಿದ ವರ್ಷ / Year of Birth"
                      views={["year"]}
                      minDate={new Date("1925-01-01")}
                      maxDate={new Date()}
                      value={field.value || null}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      slotProps={{
                        textField: {
                          variant: "standard",
                          sx: { m: 2, width: "100%" },
                          error: !!errors.dob,
                          helperText: errors.dob?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </>
          )}

          {/* STEP 3: Address Info */}
          {currentStep === 2 && (
            <>
              <TextField
                sx={{ m: 2 }}
                variant="standard"
                label="ಮನೆ ಹೆಸರು ಅಥವಾ ಸಂಖ್ಯೆ / Building number"
                style={{ width: "100%" }}
                {...register("address1", { required: "ಮನೆ ಹೆಸರು ಅಥವಾ ಸಂಖ್ಯೆ ತಿಳಿಸಿ." })}
              />

              <TextField
                sx={{ m: 2 }}
                variant="standard"
                label="ರಸ್ತೆ ಸಂಖ್ಯೆ ಮತ್ತು ಬಡಾವಣೆ / Street/area"
                style={{ width: "100%" }}
                {...register("address2", { required: "ರಸ್ತೆ ವಿವರ ತಿಳಿಸಿ." })}
              />

              <TextField
                sx={{ m: 2 }}
                variant="standard"
                label="ಅಂಚೆ ಪೆಟ್ಟಿಗೆ ಸಂಖ್ಯೆ ಮತ್ತು ಊರಿನ ಹೆಸರು"
                style={{ width: "100%" }}
                {...register("address3", { required: "ಸ್ಥಳ ಮಾಹಿತಿ ತಿಳಿಸಿ." })}
              />

              <TextField
                sx={{ m: 2 }}
                variant="standard"
                label="Pincode"
                type="text"
                style={{ width: "100%" }}
                inputProps={{ maxLength: 6 }}
                {...register("pincode", {
                  required: "ಅಂಚೆ pincode ಸಂಖ್ಯೆ ತಿಳಿಸಿ. / Please enter your area pincode.",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Pincode must be exactly 6 digits.",
                  },
                })}
                error={!!errors.pincode}
                helperText={errors.pincode?.message}
              />

              <TextField
                sx={{ m: 2 }}
                variant="standard"
                label="ಸ್ಥಳದ ಲಿಂಕ್ / Location URL (optional)"
                style={{ width: "100%" }}
                placeholder="Paste Google Maps location link"
                {...register("locationUrl")}
              />
            </>
          )}

          {/* STEP 4: Education */}
          {currentStep === 3 && (
            <>
              <InputLabel id="education-label" required>ಶಿಕ್ಷಣ/Education</InputLabel>
              <Controller
                name="education"
                control={control}
                rules={{ required: "ನಿಮ್ಮ ವಿದ್ಯಾಭ್ಯಾಸದ ಮಾಹಿತಿ ತಿಳಿಸಿ. / Please select your education." }}
                render={({ field }) => (
                  <>
                    <Select 
                      {...field}
                      id="education" 
                      labelId="education-label"
                      variant="standard" 
                      sx={{ m: 2 }} 
                      style={{ width: "100%" }}
                      displayEmpty
                    >
                      <MenuItem value=""><em>Select Education</em></MenuItem>
                      {education.map((ed, index) => (
                        <MenuItem key={index} value={ed}>{ed}</MenuItem>
                      ))}
                    </Select>
                    <div style={{ fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                      {errors.education?.message}
                    </div>
                  </>
                )}
              />

              {selectedEducation === "Other" && (
                <>
                  <TextField 
                    sx={{ m: 2 }} 
                    variant="standard" 
                    label="Please specify" 
                    style={{ width: "100%" }} 
                    {...register("otherEducation", { required: "ವಿದ್ಯಾಭ್ಯಾಸದ ಮಾಹಿತಿ ತಿಳಿಸಿ. / Please specify your education." })} 
                  />
                  <div style={{ width: "100%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                    {errors.otherEducation?.message}
                  </div>
                </>
              )}
            </>
          )}

          {/* STEP 5: Profession & Work */}
          {currentStep === 4 && (
            <>
              <InputLabel id="profession-label">ವೃತ್ತಿ/Profession</InputLabel>
              <Controller
                name="profession"
                control={control}
                render={({ field }) => (
                  <Select 
                    {...field}
                    id="profession" 
                    labelId="profession-label"
                    variant="standard" 
                    sx={{ m: 2 }} 
                    style={{ width: "100%" }}
                    displayEmpty
                  >
                    <MenuItem value=""><em>Select Profession</em></MenuItem>
                    {profession.map((p, index) => (
                      <MenuItem key={index} value={p}>{p}</MenuItem>
                    ))}
                  </Select>
                )}
              />

              {selectedProfession === "Other" && (
                <TextField 
                  sx={{ m: 2 }} 
                  variant="standard" 
                  label="Please specify" 
                  style={{ width: "100%" }} 
                  {...register("otherProfession")} 
                />
              )}

              <TextField 
                sx={{ m: 2 }} 
                variant="standard" 
                label="ಕೆಲಸದ ಮಾಹಿತಿ / Work details" 
                style={{ width: "100%" }} 
                {...register("work")} 
              />
            </>
          )}

          {/* Navigation Buttons */}
          <div
            style={{
              display: "flex",
              marginTop: "32px",
              gap: "16px",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => router.push("/")}
              variant="outlined"
              style={{ flex: 1 }}
            >
              Cancel
            </Button>

            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                variant="outlined"
                style={{ flex: 1 }}
              >
                Previous
              </Button>
            )}

            {currentStep === totalSteps - 1 ? (
              <LoadingButton
                onClick={handleSubmit(submitEventDetails)}
                loading={isSubmitting}
                disabled={isSubmitting}
                variant="contained"
                style={{ flex: 1 }}
              >
                Submit
              </LoadingButton>
            ) : (
              <LoadingButton
                onClick={nextStep}
                loading={isSubmitting}
                disabled={!isStepValid || isSubmitting}
                variant="contained"
                style={{ flex: 1 }}
              >
                Save & Next
              </LoadingButton>
            )}
          </div>
        </Box>
      </Container>
    </>
  );
}
