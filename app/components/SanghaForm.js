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
    formState: { isSubmitting, isValid, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      vibhag: "",
      bhag: "",
      nagar: "",
      vasati: "",
      upavasati: "",
      shakhe: "",
      name: "",
      phone: "",
      emailOption: "No",
      email: "",
      address1: "",
      address2: "",
      address3: "",
      pincode: "",
      bloodgroup: "",
      dob: "",
      education: "",
      otherEducation: "",
      profession: "",
      otherProfession: "",
      work: "",
      sanghShikshan: "",
      sanghaResponsibility: "",
      sanghOrganizationName: "",
      otherResponsibility: "",
    },
  });

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

 // Load only Vibhag initially
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


// Load Bhags when Vibhag changes
useEffect(() => {
  if (!selectedVibhag) {
    setBhags([]);
    return;
  }

  async function loadBhags() {
    const res = await fetch(
      `/api/entities?sthara=Bhag&parent=${selectedVibhag}`
    );
    const data = await res.json();
    setBhags(data);
  }

  loadBhags();
}, [selectedVibhag]);


// Load Nagars when Bhag changes
useEffect(() => {
  if (!selectedBhag) {
    setNagars([]);
    return;
  }

  async function loadNagars() {
    const res = await fetch(
      `/api/entities?sthara=Taluku&parent=${selectedBhag}`
    );
    const data = await res.json();
    setNagars(data);
  }

  loadNagars();
}, [selectedBhag]);


// Load Vasatis when Nagar changes
useEffect(() => {
  if (!selectedNagar) {
    setVasatis([]);
    return;
  }

  async function loadVasatis() {
    const res = await fetch(
      `/api/entities?sthara=Mandala&parent=${selectedNagar}`
    );
    const data = await res.json();
    setVasatis(data);
  }

  loadVasatis();
}, [selectedNagar]);


// Load Upavasatis when Vasati changes
useEffect(() => {
  if (!selectedVasati) {
    setUpavasatis([]);
    return;
  }

  async function loadUpavasatis() {
    const res = await fetch(
      `/api/entities?sthara=Grama&parent=${selectedVasati}`
    );
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      const result = await res.json();

      if (result.success) {
        alert("Saved successfully");
        reset();
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
      <div
        style={{
          background: "#1976D2",
          color: "white",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "auto" }}>
          <div style={{ fontSize: "18px", fontWeight: "600" }}>
            ಸಂಘ ಪೋರಕ ಸಾಧನ
          </div>
          <div style={{ fontSize: "12px" }}>
            ನಮ್ಮ ನಡೆ ಗುರು ತತ್ವದೆಡೆ
          </div>
        </div>
      </div>

      <Container maxWidth="md" sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box component="form" onSubmit={handleSubmit(submitEventDetails)} noValidate sx={{ mt: 1, minWidth: 300 }}>
          
          {/* VIBHAG */}
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
                  style={{ width: "90%" }} 
                  sx={{ m: 1 }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Vibhag</em>
                  </MenuItem>
                  {vibhags?.map((v) => (
                    <MenuItem key={v._id} value={v._id}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                  {errors.vibhag?.message}
                </div>
              </>
            )}
          />

          {/* BHAG */}
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
                  style={{ width: "90%" }} 
                  sx={{ m: 1 }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Bhag</em>
                  </MenuItem>
                  {bhags?.map((b) => (
                    <MenuItem key={b._id} value={b._id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                  {errors.bhag?.message}
                </div>
              </>
            )}
          />

          {/* NAGAR */}
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
                  style={{ width: "90%" }} 
                  sx={{ m: 1 }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Nagar</em>
                  </MenuItem>
                  {nagars?.map((n) => (
                    <MenuItem key={n._id} value={n._id}>
                      {n.name}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                  {errors.nagar?.message}
                </div>
              </>
            )}
          />

          {/* VASATI */}
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
                  style={{ width: "90%" }} 
                  sx={{ m: 1 }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Vasati</em>
                  </MenuItem>
                  {vasatis?.map((v) => (
                    <MenuItem key={v._id} value={v._id}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                  {errors.vasati?.message}
                </div>
              </>
            )}
          />

          {/* UPAVASATI */}
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
                  style={{ width: "90%" }} 
                  sx={{ m: 1 }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Upavasati</em>
                  </MenuItem>
                  {upavasatis?.map((u) => (
                    <MenuItem key={u._id} value={u._id}>
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "8px" }}>
                  {errors.upavasati?.message}
                </div>
              </>
            )}
          />

          {/* SHAKHE */}
          <InputLabel id="shakhe-label">ಶಾಖೆ/ಮಿಲನ/Shakhe/Milan</InputLabel>
          <TextField id="shakhe" variant="standard" sx={{ m: 1 }} style={{ width: "90%" }} placeholder="ನಿಮ್ಮ ಹತ್ತಿರದ ಶಾಖೆ/ಮಿಲನ ಹೆಸರು. / Nearest shakhe or Milan name." {...register("shakhe")} />

          {/* NAME */}
          <TextField sx={{ m: 2 }} variant="standard" label="ಹೆಸರು/Name" style={{ width: "90%" }} {...register("name", { required: "ನಿಮ್ಮ ಹೆಸರು ತಿಳಿಸಿ. / Please enter your name." })} />
          <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>{errors.name?.message}</div>

          {/* PHONE */}
          <TextField sx={{ m: 2 }} variant="standard" label="10 ಅಂಕಿಯ ದೂರವಾಣಿ ಸಂಖ್ಯೆ/10 digit Phone number" type="tel" style={{ width: "90%" }} {...register("phone", { required: "ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ತಿಳಿಸಿ. / Please enter your 10 digit phone number.", pattern: { value: /^[0-9]{10}$/, message: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 10 ಅಂಕಿಯ ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು / Phone number must be exactly 10 digits." } })} />
          <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>{errors.phone?.message}</div>

          
          
{/* EMAIL OPTION */}
<Controller
  name="emailOption"
  control={control}
  render={({ field }) => (
    <RadioGroup row {...field}>
      <FormControlLabel
        value="No"
        control={<Radio />}
        label="ಇಮೇಲ್ ಐಡಿ ಇಲ್ಲ / I don't have email id"
        sx={{ m: 2 }}
      />
      <FormControlLabel
        value="Yes"
        control={<Radio />}
        label="ಇಮೇಲ್ ಐಡಿ ಇದೆ / I have email ID"
        sx={{ m: 2 }}
      />
    </RadioGroup>
  )}
/>

{/* EMAIL FIELD ONLY */}
{selectedEmailOption === "Yes" && (
  <>
    <TextField
      sx={{ m: 2 }}
      variant="standard"
      label="ಇಮೇಲ್/email"
      style={{ width: "90%" }}
      {...register("email", {
        required: "ಇಮೇಲ್ id ತಿಳಿಸಿ.",
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Please enter a valid email address.",
        },
      })}
    />
    <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
      {errors.email?.message}
    </div>
  </>
)}
{/* ADDRESS */}
<TextField
  sx={{ m: 2 }}
  variant="standard"
  label="ಮನೆ ಹೆಸರು ಅಥವಾ ಸಂಖ್ಯೆ / Building number"
  style={{ width: "90%" }}
  {...register("address1", { required: "ಮನೆ ಹೆಸರು ಅಥವಾ ಸಂಖ್ಯೆ ತಿಳಿಸಿ." })}
/>

<TextField
  sx={{ m: 2 }}
  variant="standard"
  label="ರಸ್ತೆ ಸಂಖ್ಯೆ ಮತ್ತು ಬಡಾವಣೆ / Street/area"
  style={{ width: "90%" }}
  {...register("address2", { required: "ರಸ್ತೆ ವಿವರ ತಿಳಿಸಿ." })}
/>

<TextField
  sx={{ m: 2 }}
  variant="standard"
  label="ಅಂಚೆ ಪೆಟ್ಟಿಗೆ ಸಂಖ್ಯೆ ಮತ್ತು ಊರಿನ ಹೆಸರು"
  style={{ width: "90%" }}
  {...register("address3", { required: "ಸ್ಥಳ ಮಾಹಿತಿ ತಿಳಿಸಿ." })}
/>

         {/* PINCODE */}
<TextField
  sx={{ m: 2, width: "90%" }}
  variant="standard"
  label="Pincode"
  type="text"
  required   // ⭐ shows star
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
{/* LOCATION URL (OPTIONAL) */}
<TextField
  sx={{ m: 2 }}
  variant="standard"
  label="ಸ್ಥಳದ ಲಿಂಕ್ / Location URL (optional)"
  style={{ width: "90%" }}
  placeholder="Paste Google Maps location link"
  {...register("locationUrl", {
    validate: (value) => {
      if (!value) return true; 
      try {
        new URL(value);
        return true;
      } catch (err) {
        return "Please enter a valid URL";
      }
    },
  })}
/>

<div style={{ fontSize: "0.8rem", color: "red" }}>
  {errors.locationUrl?.message}
</div>
       
          {/* BLOOD GROUP */}
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
                  style={{ width: "90%" }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Blood Group</em>
                  </MenuItem>
                  {bloodgroup.map((bg, index) => (
                    <MenuItem key={index} value={bg}>
                      {bg}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                  {errors.bloodgroup?.message}
                </div>
              </>
            )}
          />

          
          {/* YEAR OF BIRTH */}
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
            sx: { m: 2, width: "90%" },
            error: !!errors.dob,
            helperText: errors.dob?.message,
          },
        }}
      />
    )}
  />
</LocalizationProvider>
          {/* EDUCATION */}
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
                  style={{ width: "90%" }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Education</em>
                  </MenuItem>
                  {education.map((ed, index) => (
                    <MenuItem key={index} value={ed}>
                      {ed}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                  {errors.education?.message}
                </div>
              </>
            )}
          />

          {/* OTHER EDUCATION */}
          {selectedEducation === "Other" && (
            <>
              <TextField sx={{ m: 2 }} variant="standard" label="Please specify" style={{ width: "90%" }} {...register("otherEducation", { required: "ವಿದ್ಯಾಭ್ಯಾಸದ ಮಾಹಿತಿ ತಿಳಿಸಿ. / Please specify your education." })} />
              <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>{errors.otherEducation?.message}</div>
            </>
          )}

          {/* SANGHA SHIKSHANA */}
          <InputLabel id="sangh-label" required>ಸಂಘದ ಶಿಕ್ಷಣ</InputLabel>
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
                  sx={{ m: 2 }} 
                  style={{ width: "90%" }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select Sangha Shikshana</em>
                  </MenuItem>
                  {sanghaShikshana.map((ss, index) => (
                    <MenuItem key={index} value={ss}>
                      {ss}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                  {errors.sanghShikshan?.message}
                </div>
              </>
            )}
          />
          {/* RESPONSIBILITY */}
          <InputLabel id="responsibility-label" required>ಸಂಘದ ಜವಾಬ್ದಾರಿ / Responsibility</InputLabel>
          <Controller
            name="sanghaResponsibility"
            control={control}
            rules={{ required: "ಸಂಘದ ಜವಾಬ್ದಾರಿ ಆಯ್ಕೆ ಮಾಡಿ. / Select your responsibility in Sangha." }}
            render={({ field }) => (
              <>
                <Select 
                  {...field}
                  id="sanghaResponsibility" 
                  labelId="responsibility-label"
                  variant="standard" 
                  sx={{ m: 2 }} 
                  style={{ width: "90%" }}
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
                <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>
                  {errors.sanghaResponsibility?.message}
                </div>
              </>
            )}
          />

          {/* Organization Name */}
          {selectedSanghResponsibility === "ವಿವಿಧ ಕ್ಷೇತ್ರದ ಜವಾಬ್ದಾರಿ/Vividh Khsetra Responsibility" && (
            <>
              <TextField sx={{ m: 2 }} variant="standard" label="ಸಂಘಟನೆಯ ಹೆಸರು / Organization name" style={{ width: "90%" }} {...register("sanghOrganizationName", { required: "ಸಂಘಟನೆಯ ಹೆಸರು ತಿಳಿಸಿ / Please specify organization name." })} />
              <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>{errors.sanghOrganizationName?.message}</div>
            </>
          )}

          {/* Other Responsibility */}
          {selectedSanghResponsibility && selectedSanghResponsibility !== "ಸ್ವಯಂಸೇವಕ/Swayamsevak" && (
            <>
              <TextField sx={{ m: 2 }} variant="standard" label="ನಿಮ್ಮ ಜವಾಬ್ದಾರಿಯನ್ನು ತಿಳಿಸಿ / Please specify your responsibility" style={{ width: "90%" }} {...register("otherResponsibility", { required: "ಸಂಘದಲ್ಲಿ ನಿಮ್ಮ ಜವಾಬ್ದಾರಿಯನ್ನು ತಿಳಿಸಿ / Please specify your responsibility." })} />
              <div style={{ width: "90%", fontSize: "0.8rem", color: "red", marginLeft: "16px" }}>{errors.otherResponsibility?.message}</div>
            </>
          )}

          {/* PROFESSION (Optional) */}
          <InputLabel id="profession-label">ವೃತ್ತಿ/Profession (optional)</InputLabel>
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
                style={{ width: "90%" }}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Profession</em>
                </MenuItem>
                {profession.map((p, index) => (
                  <MenuItem key={index} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          {/* Other Profession */}
          {selectedProfession === "Other" && (
            <TextField sx={{ m: 2 }} variant="standard" label="(optional) Please specify" style={{ width: "90%" }} {...register("otherProfession")} />
          )}

          {/* WORK DETAILS (Optional) */}
          <TextField sx={{ m: 2 }} variant="standard" label="(optional) ಕೆಲಸದ ಮಾಹಿತಿ / Work details" style={{ width: "90%" }} {...register("work")} />

          {/* BUTTONS */}
          <div style={{ display: "flex", marginTop: "16px", gap: "8px" }}>
            <Button 
              onClick={() => router.push("/")} 
              variant="outlined" 
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
            <LoadingButton
             loading={isSubmitting}
             disabled={!isValid || isSubmitting}
             type="submit"
            variant="contained"
           sx={{ flex: 1 }}
          >
              Submit
            </LoadingButton>
          </div>
        </Box>
      </Container>
    </>
  );
}
