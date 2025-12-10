"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { apiFetch } from "../../utils/api";

export default function Step1() {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [capacityMessage, setCapacityMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const goNext = async () => {
    if (!status) return;

    setLoading(true);
    const endpoint =
      status === "graduate"
        ? "capacity/check/graduate"
        : "capacity/check/student";

    try {
      const data = await apiFetch(endpoint, {
        method: "GET",
      });

      console.log("CAPACITY RESPONSE => ", data);

      if (data.status === "full") {
        setCapacityMessage(
          `ظرفیت ${status === "student" ? "دانشجو" : "فارغ‌التحصیل"
          } ها تکمیل شده است.`
        );
        setOpenModal(true);
        return;
      }

      localStorage.setItem("signup-step1", JSON.stringify({ status }));
      navigate("/create/step2");
    } catch (error) {
      console.error("CAPACITY CHECK ERROR:", error);
      if (error.message === "RESPONSE_NOT_JSON") {
        setCapacityMessage("خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.");
      } else {
        setCapacityMessage("خطایی رخ داد. لطفا دوباره تلاش کنید.");
      }
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  function LabelWithIcons({ label, isStudent }) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ flexGrow: 1, fontFamily: "regular", gap: "5px" }}
      >
        {isStudent ? (
          <MenuBookIcon fontSize="medium" color="action" />
        ) : (
          <SchoolIcon fontSize="medium" color="action" />
        )}
        <span style={{ color: "grey" }}>{label}</span>
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        height: { xs: "100dvh", sm: "100vh" },
        minHeight: { xs: "-webkit-fill-available", sm: "100vh" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "500px",
        mx: "auto",
        overflow: "hidden"
      }}
    >
      <Navbar step="step1" />

      <Box
        sx={{
          flexGrow: 1,
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          px: 1,
          overflowY: "auto"
        }}
      >
        <RadioGroup
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%"
          }}
        >
          <FormControlLabel
            value="graduate"
            label={<LabelWithIcons label="فارغ‌التحصیل" isStudent={false} />}
            labelPlacement="start"
            control={
              <Radio
                sx={{
                  color: "#01144f",
                  "&.Mui-checked": {
                    color: "#01144f"
                  }
                }}
              />
            }
            sx={{
              margin:0,
              border: 1,
              borderColor: status === "graduate" ? "#01144f" : "grey.400",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                borderColor: "#01144f",
                backgroundColor: "rgba(1, 20, 79, 0.05)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              }
            }}
          />

          <FormControlLabel

            value="student"
            label={<LabelWithIcons label="دانشجو" isStudent={true} />}
            labelPlacement="start"
            control={
              <Radio
                sx={{
                  
                  color: "#01144f",
                  "&.Mui-checked": {
                    color: "#01144f"
                  }
                }}
              />
            }
            sx={{
              border: 1,
              margin:0,

              borderColor: status === "student" ? "#01144f" : "grey.400",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                borderColor: "#01144f",
                backgroundColor: "rgba(1, 20, 79, 0.05)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              }
            }}
          />
        </RadioGroup>

        <Box
          sx={{
            pb: { xs: 3, sm: 3 },
            width: "100%",
            display: "flex",
            justifyContent: "center",
            px: 1,
            flexShrink: 0
          }}
        >
          <Button
            variant="contained"
            disabled={!status || loading}
            onClick={goNext}
            sx={{
              width: "100%",
              height: "55px",
              fontFamily: "medium",
              backgroundColor: status && !loading ? "#01144f" : "#c2c2c2",
              fontSize: "20px",
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
            {loading ? "در حال بررسی..." : "ادامه"}
          </Button>
        </Box>
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
            {capacityMessage}
          </Typography>

          <Button
            variant="contained"
            onClick={() => setOpenModal(false)}
            sx={{
              width: "100%",
              fontFamily: "medium",
              backgroundColor: "#01144f",
              mt: 2,
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