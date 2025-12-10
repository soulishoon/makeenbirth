"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { apiFetch } from "../../utils/api";

export default function Retrieve() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [modalText, setModalText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    setPhone(value);
  };

  const handleFindCard = async () => {
    if (!phone.startsWith("09") || phone.length !== 11) {
      setModalText("لطفا شماره را درست وارد کنید");
      setOpenModal(true);
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch(`guest/show/${phone}`, {
        method: "GET",
      });
      console.log("FULL API RESPONSE:", data);

      if (data.status === true && data.Guest) {
        const guest = data.Guest;
        
        console.log("Guest data from API:", guest);
        
        let finalImage = null;

        // اول media رو چک کن
        if (guest.media && guest.media.length > 0) {
          finalImage = guest.media[0].original_url;
          console.log("Image from media:", finalImage);
        } 
        // بعد image رو چک کن
        else if (guest.image) {
          if (guest.image.startsWith("http")) {
            finalImage = guest.image;
          } else {
            finalImage = `https://panel.makeenacademy.ir/storage/guests/${guest.image}`;
          }
          console.log("Image from image field:", finalImage);
        }

        // ذخیره تمام داده‌ها
        localStorage.setItem(
          "retrieve-data",
          JSON.stringify({
            name: guest.name,
            phoneNumber: guest.phoneNumber,
            field: guest.field,
            status: guest.status,
            bootcampNumber: guest.bootcampNumber,
            ProgrammingLanguage: guest.ProgrammingLanguage,
            image: finalImage,
           
            // برای دیباگ - همه فیلدها رو ذخیره کن
            _allData: guest
          })
        );

        console.log("Saved to localStorage:", {
          name: guest.name,
          field: guest.field,
          phoneNumber: guest.phoneNumber,
          image: finalImage
        });

        navigate("/create/step4");
      } else {
        console.log("No guest found or API returned false");
        setModalText("شماره‌ای با این مشخصات یافت نشد");
        setOpenModal(true);
      }

    } catch (err) {
      console.error("ERROR in retrieve:", err);
      if (err.message === "RESPONSE_NOT_JSON") {
        setModalText("خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.");
      } else {
        setModalText("مشکلی پیش آمده، دوباره تلاش کنید");
      }
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        maxWidth: "600px",
        mx: "auto",
        flexDirection: "column",
        pb: 2
      }}
    >
      <Navbar step="retrieve" />

      <Box
        sx={{
          flexGrow: 1,
          mt: 4,
          px: 1,
          pb: { xs: 2, sm: 2 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <TextField
          fullWidth
          placeholder="09123456789"
          value={phone}
          onChange={handlePhoneChange}
          disabled={loading}
          inputMode="numeric"
          sx={{
            direction: "ltr",
            "& input": {
              fontFamily: "regular",
              textAlign: "right",
            },
            "& .MuiOutlinedInput-root": {
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

        <Button
          variant="contained"
          sx={{
            mx: "auto",
            display: "block",
            width: "100%",
            height: "55px",
            fontFamily: "medium",
            fontSize: "20px",
            backgroundColor: phone.length === 11 ? "#01144f" : "#c2c2c2",
            transition: "all 0.3s ease",
            "&:disabled": {
              backgroundColor: "#c2c2c2"
            },
            "&:hover:not(:disabled)": {
              backgroundColor: "#012a7a",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(1, 20, 79, 0.3)"
            },
            "&:active:not(:disabled)": {
              transform: "translateY(0)"
            }
          }}
          onClick={handleFindCard}
          disabled={loading || phone.length !== 11}
        >
          {loading ? "در حال جستجو..." : "دریافت کارت"}
        </Button>
      </Box>

      <Modal 
        open={openModal} 
        onClose={() => setOpenModal(false)}
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
            p: 3,
            width: "80%",
            maxWidth: "400px",
            textAlign: "center",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            animation: "scaleIn 0.2s ease-out"
          }}
        >
          <Typography sx={{ fontFamily: "regular", mb: 2 }}>
            {modalText}
          </Typography>

          <Button
            variant="contained"
            onClick={() => setOpenModal(false)}
            sx={{
              width: "100%",
              fontFamily: "medium",
              backgroundColor: "#01144f",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#012a7a",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(1, 20, 79, 0.3)"
              }
            }}
          >
            متوجه شدم
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
}