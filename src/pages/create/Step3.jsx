"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Step3() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  // آپلود عکس
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  // حذف عکس
  const handleDelete = () => {
    setImage(null);
    setImageFile(null);
    setOpenDeleteModal(false);
  };

  // ولیدیشن شماره موبایل
  const handlePhoneChange = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    setPhone(v);
  };

  // ارسال اطلاعات به سرور (POST)
const handleNext = async () => {
  if (phone.length !== 11 || !phone.startsWith("09")) {
    setOpenPhoneModal(true);
    return;
  }

  setLoading(true);

  try {
    const step1 = JSON.parse(localStorage.getItem("signup-step1")) || {};
    const step2 = JSON.parse(localStorage.getItem("signup-step2")) || {};
    const step3 = {
      fullName,
      phone,
      image,
    };

    const formData = new FormData();
    formData.append("name", step3.fullName);
    formData.append("status", step1.status || "");
    formData.append("phoneNumber", step3.phone);
    formData.append("field", step2.major || "");
    formData.append("bootcampNumber", step2.bootcamp || "");
    formData.append("ProgrammingLanguage", step2.language || "");

    if (imageFile) {
      const blob = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          fetch(reader.result)
            .then(r => r.blob())
            .then(resolve)
            .catch(reject);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      formData.append("image", blob, "photo.png");
    }

    const res = await fetch("https://panel.makeenacademy.ir/api/guest/store", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("خطا در ارسال اطلاعات");
    }

    // ذخیره شماره تلفن
    localStorage.setItem("signup-phone", phone);

    // پاک کردن بقیه localStorage به جز signup-phone
    Object.keys(localStorage).forEach((key) => {
      if (key !== "signup-phone") {
        localStorage.removeItem(key);
      }
    });

    navigate("/create/step4");
  } catch (err) {
    alert(err.message || "خطایی رخ داده");
  } finally {
    setLoading(false);
  }
};



  return (
    <Box
      sx={{
        height: "100vh",
        height: "100dvh", // Dynamic viewport height برای iOS
        minHeight: "-webkit-fill-available", // Fallback برای Safari
        maxWidth: "500px",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <Navbar step="step3" />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          px: 1,
          mt: 3
        }}
      >
        <Box
          sx={{
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: "2px dashed #999",
            mx: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backgroundColor: image ? "transparent" : "rgba(1, 20, 79, 0.02)",
            "&:hover": {
              borderColor: "#01144f",
              backgroundColor: image ? "transparent" : "rgba(1, 20, 79, 0.05)",
              transform: "scale(1.05)",
              boxShadow: image ? "none" : "0 4px 12px rgba(0,0,0,0.1)"
            },
            "&:active": {
              transform: "scale(1.02)"
            }
          }}
          onClick={() => document.getElementById("upload-input").click()}
        >
          {image ? (
            <img
              src={image}
              alt="preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography sx={{ fontFamily: "regular", color: "#777" }}>
              + افزودن عکس
            </Typography>
          )}

          <input
            id="upload-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </Box>

        <Button
          startIcon={<DeleteIcon />}
          disabled={!image}
          onClick={() => setOpenDeleteModal(true)}
          sx={{
            mx: "auto",
            fontFamily: "regular",
            color: image ? "#CF7721" : "rgba(0,0,0,0.38)",
            transition: "all 0.3s ease",
            "&:hover:not(:disabled)": {
              backgroundColor: "rgba(207, 119, 33, 0.1)",
              transform: "translateY(-2px)"
            }
          }}
        >
          حذف عکس
        </Button>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ fontFamily: "regular", pr: 1 }}>
            نام و نام خانوادگی
          </Typography>
          <TextField
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="مثال: علی رضایی"
            sx={{ 
              "& .MuiInputBase-root": { 
                fontFamily: "regular",
                transition: "all 0.3s ease"
              },
              "& .MuiOutlinedInput-root:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#01144f"
                }
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#01144f",
                  borderWidth: 2
                }
              }
            }}
          />

          <Typography sx={{ fontFamily: "regular", pr: 1 }}>
            شماره تماس
          </Typography>
          <TextField
            fullWidth
            value={phone}
            onChange={handlePhoneChange}
            placeholder="09123456789"
            inputMode="numeric"
            sx={{ 
              "& .MuiInputBase-root": { 
                fontFamily: "regular",
                transition: "all 0.3s ease"
              },
              "& .MuiOutlinedInput-root:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#01144f"
                }
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#01144f",
                  borderWidth: 2
                }
              }
            }}
          />
        </Box>

        <Box sx={{ 
          mt: "auto", 
          pb: { xs: 4, sm: 3 }, // padding بیشتر در موبایل برای iOS
          paddingBottom: { xs: "calc(24px + env(safe-area-inset-bottom))", sm: 3 }, // پشتیبانی از safe-area در iPhone
          px: 1 
        }}>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            sx={{
              width: "100%",
              height: "55px",
              fontSize: "20px",
              fontFamily: "medium",
              backgroundColor:
                fullName && phone && (phone.length === 11) ? "#01144f" : "#c2c2c2",
              transition: "all 0.3s ease",
              "&:hover:not(:disabled)": {
                backgroundColor: "#012a7a",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(1, 20, 79, 0.3)"
              },
              "&:active:not(:disabled)": {
                transform: "translateY(0)"
              }
            }}
          >
            {loading ? "در حال ارسال..." : "ادامه"}
          </Button>
        </Box>
      </Box>

      <Modal 
        open={openDeleteModal} 
        onClose={() => setOpenDeleteModal(false)}
        sx={{
          backdropFilter: "blur(4px)",
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }
        }}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            animation: "scaleIn 0.2s ease-out"
          }}
        >
          <DeleteIcon sx={{ fontSize: 40, color: "#CF7721", mb: 1 }} />
          <Typography sx={{ fontFamily: "regular", mb: 2 }}>
            آیا از حذف عکس مطمئن هستید؟
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{ 
                fontFamily: "regular",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }
              }}
              onClick={() => setOpenDeleteModal(false)}
            >
              انصراف
            </Button>

            <Button
              variant="contained"
              sx={{ 
                backgroundColor: "#CF7721", 
                fontFamily: "regular",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#b8651a",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(207, 119, 33, 0.3)"
                }
              }}
              onClick={handleDelete}
            >
              حذف
            </Button>
          </Box>
        </Paper>
      </Modal>

      <Modal 
        open={openPhoneModal} 
        onClose={() => setOpenPhoneModal(false)}
        sx={{
          backdropFilter: "blur(4px)",
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }
        }}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            animation: "scaleIn 0.2s ease-out"
          }}
        >
          <Typography sx={{ color: "red", mb: 2, fontFamily: "regular" }}>
            لطفا شماره را درست وارد کنید
          </Typography>

          <Button
            variant="contained"
            sx={{
              width: "80%",
              backgroundColor: "#CF7721",
              fontFamily: "regular",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#b8651a",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(207, 119, 33, 0.3)"
              }
            }}
            onClick={() => setOpenPhoneModal(false)}
          >
            متوجه شدم
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
}
