
"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { Box, Button, Typography, Modal, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { apiFetch } from "../../utils/api";

export default function Step4() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [data, setData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [imageReady, setImageReady] = useState(false);

  // -----------------------------
  // 📌 کلید اصلی: اسکرین‌شات کارت
  // -----------------------------
  const loadFontAsDataURI = async (fontPath) => {
    try {
      const response = await fetch(fontPath);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`Error loading font ${fontPath}:`, error);
      return null;
    }
  };

  const waitForAssets = async () => {
    // صبر کردن تا فونت‌ها لود شوند
    await document.fonts.ready;

    // اطمینان از لود شدن همه فونت‌های فارسی با تست واقعی
    const testText = 'تست';
    const fontsToLoad = [
      { name: 'medium', test: `16px "medium"` },
      { name: 'bold', test: `16px "bold"` },
      { name: 'regular', test: `16px "regular"` },
      { name: 'kalamehregular', test: `16px "kalamehregular"` },
      { name: 'kalamehmedium', test: `16px "kalamehmedium"` }
    ];

    // صبر تا همه فونت‌ها لود شوند
    let allLoaded = false;
    let attempts = 0;
    while (!allLoaded && attempts < 50) {
      allLoaded = fontsToLoad.every(font => {
        return document.fonts.check(font.test, testText);
      });
      if (!allLoaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
    }

    // صبر اضافی برای اطمینان از رندر شدن فونت‌ها
    await new Promise(resolve => setTimeout(resolve, 500));

    if (imageReady) return;
    await new Promise((resolve) => {
      const start = Date.now();
      const timer = setInterval(() => {
        if (imageReady || Date.now() - start > 3000) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  };





const handleDownload = async () => {
  if (!cardRef.current) return;

  try {
    const cardWidth = 330;
    const cardHeight = 550;
    const scale = 2; // for sharpness

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = cardWidth * scale;
    canvas.height = cardHeight * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Load background image
    const cardImage = new Image();
    cardImage.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      cardImage.onload = resolve;
      cardImage.onerror = reject;
      cardImage.src = '/images/card.jpg';
    });

    // Draw background
    ctx.drawImage(cardImage, 0, 0, cardWidth, cardHeight);

    // Draw user photo if available
    if (data.image) {
      const userImage = new Image();
      userImage.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        userImage.onload = resolve;
        userImage.onerror = () => {
          console.warn('User image failed to load');
          resolve();
        };
        userImage.src = data.image;
      });

      if (userImage.complete && userImage.naturalWidth > 0) {
        const photoRight = 74.75;
        const photoTop = 225.5;
        const photoSize = 80;
        const borderWidth = 2;
        const padding = 3;

        const centerX = cardWidth - photoRight - photoSize / 2;
        const centerY = photoTop + photoSize / 2;

        // Draw border circle (outer)
        ctx.beginPath();
        ctx.arc(centerX, centerY, photoSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(255, 170, 0)';
        ctx.fill();

        // Draw inner white padding circle
       

        // Clip to circle for user image inside padding area
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, photoSize / 2 - borderWidth - padding, 0, Math.PI * 2);
        ctx.clip();

        // Draw user image scaled to fit inside clipped circle
        const innerSize = photoSize - 2 * (borderWidth + padding);
        const imageX = cardWidth - photoRight - photoSize + borderWidth + padding;
        const imageY = photoTop + borderWidth + padding;
        ctx.drawImage(userImage, imageX, imageY, innerSize, innerSize);

        ctx.restore();
      }
    }

    // Load fonts exactly as "kalamehmedium"
    const baseUrl = window.location.origin;
    const kalamehMediumFont = new FontFace("kalamehmedium", `url(${baseUrl}/fonts/iranyekanwebmedium.woff)`);
    await kalamehMediumFont.load();
    document.fonts.add(kalamehMediumFont);
    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 200));

    // Draw texts

    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';

    // Name
    ctx.font = '20px kalamehmedium';
    ctx.fillText(data.name, cardWidth - 170, 235);

    // Field - normal weight (400), same font family
    ctx.font = '20px kalamehmedium'; // kalamehmedium but normal weight, canvas doesn't support fontWeight so keep same font
    ctx.fillText(
      data.field === "programmer" ? "Developer" :
      data.field === "uiux" ? "UI/UX" :
      data.field,
      cardWidth - 170,
      270
    );

    // Export image
    const img = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = img;
    link.download = "makeen-card.png";
    link.click();

  } catch (error) {
    console.error("Download card error:", error);
  }
};

   







  useEffect(() => {
    const retrieveRaw = localStorage.getItem("retrieve-data");
    if (retrieveRaw) {
      try {
        const parsed = JSON.parse(retrieveRaw);
        if (parsed && typeof parsed === "object") {
          setData({
            name: parsed.name,
            phoneNumber: parsed.phoneNumber,
            field: parsed.field,
            status: parsed.status,
            bootcampNumber: parsed.bootcampNumber,
            ProgrammingLanguage: parsed.ProgrammingLanguage,
            image: parsed.image,
          });
          return;
        }
      } catch (_) { }
    }

    const phone = localStorage.getItem("signup-phone");
    if (!phone) {
      navigate("/");
      return;
    }

    apiFetch(`guest/show/${phone}`, {
      method: "GET",
    })
      .then((data) => {
        if (!data || !data.Guest) {
          setModalText("اطلاعاتی از سرور یافت نشد");
          setOpenModal(true);
          return;
        }

        const guest = data.Guest;

        let finalImage = null;
        if (guest.media?.length) {
          finalImage = guest.media[0].original_url;
        } else if (guest.image) {
          finalImage =
            "https://panel.makeenacademy.ir/storage/guests/" + guest.image;
        }

        setData({
          name: guest.name,
          phoneNumber: guest.phoneNumber,
          field: guest.field,
          status: guest.status,
          bootcampNumber: guest.bootcampNumber,
          ProgrammingLanguage: guest.ProgrammingLanguage,
          image: finalImage,
        });
      })
      .catch(() => {
        setModalText("مشکل در ارتباط با سرور");
        setOpenModal(true);
      });
  }, []);

  if (!data) return null;

  return (
    <Box
      sx={{
        height: { xs: "100dvh", sm: "100vh" },
        minHeight: { xs: "-webkit-fill-available", sm: "100vh" },
        maxWidth: "500px",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <Navbar step="step4" />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          px: 1
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: "regular",
            fontSize: "20px",
            mt: 2
          }}
        >
          کارتت آماده شد 🎉
        </Typography>

        {/* CARD */}
        <Box
          ref={cardRef}
          sx={{
            width: { xs: "90%", sm: 330 },
            maxWidth: 330,
            height: { xs: "auto", sm: 550 },
            aspectRatio: { xs: "330/550", sm: "auto" },
            minHeight: 550,
            mt: 2,
            mx: "auto",
            position: "relative",
            backgroundImage: 'url("/images/card.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.2)"
            }
          }}
        >
          {/* PHOTO */}
          <Box
            sx={{
              position: "absolute",
              top: 225.5,
              right: 74.75,
              width: 80,
              height: 80,
              borderRadius: "50%",
            }}
          >
            {data.image ? (
              <img
                src={data.image}
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", border: "2px solid rgb(255, 170 , 0 )", padding: "3px" }}
                onLoad={() => setImageReady(true)}
                onError={() => setImageReady(true)}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#eee" }} />
            )}
          </Box>

          {/* NAME */}
          <Typography
            sx={{
              position: "absolute",
              top: 225,
              right: 170,
              fontFamily: "kalamehmedium",
              fontSize: "20px",
              color: "white",
            }}
          >
            {data.name}
          </Typography>

          {/* FIELD */}
          <Typography
            sx={{
              position: "absolute",
              top: 260,
              right: 170,
              fontFamily: "kalamehmedium",
              fontSize: "20px",
              fontWeight: 400,
              color: "white",
            }}
          >
            {data.field === "programmer"
              ? "Developer"
              : data.field === "uiux"
                ? "UI/UX"
                : data.field}
          </Typography>
        </Box>

      </Box>

      {/* BUTTONS */}
      <Box
        sx={{
          pb: { xs: 3, sm: 3 },
          px: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexShrink: 0
        }}
      >
        <Button
          variant="contained"
          sx={{
            fontFamily: "medium",
            backgroundColor: "#01144f",
            height: "55px",
            fontSize: "20px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#012a7a",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(1, 20, 79, 0.3)"
            },
            "&:active": {
              transform: "translateY(0)"
            }
          }}
          onClick={handleDownload}
        >
          دانلود کارت
        </Button>

        {/* <Button
          variant="contained"
          sx={{ 
            fontFamily: "medium", 
            backgroundColor: "#01144f",
            height: "55px",
            fontSize: "18px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#012a7a",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(1, 20, 79, 0.3)"
            },
            "&:active": {
              transform: "translateY(0)"
            }
          }}
          onClick={handleDownloadPDF}
        >
          دانلود PDF
        </Button> */}

        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            fontFamily: "medium",
            height: "55px",
            fontSize: "20px",
            borderColor: "#01144f",
            color: "#01144f",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#012a7a",
              backgroundColor: "rgba(1, 20, 79, 0.05)",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            },
            "&:active": {
              transform: "translateY(0)"
            }
          }}
        >
          خروج
        </Button>
      </Box>

      {/* MODAL */}
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
              height: "55px",
              fontSize: "20px",
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
