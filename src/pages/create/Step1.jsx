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

export default function Step1() {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const goNext = () => {
    if (!status) return;
    localStorage.setItem("signup-step1", JSON.stringify({ status }));
    navigate("/create/step2");
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
        overflow: "hidden",
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
          overflowY: "auto",
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
            width: "100%",
            mt: 1,
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
                    color: "#01144f",
                  },
                }}
              />
            }
            sx={{
              margin: 0,
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
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
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
                    color: "#01144f",
                  },
                }}
              />
            }
            sx={{
              margin: 0,
              border: 1,
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
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
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
            flexShrink: 0,
          }}
        >
          <Button
            variant="contained"
            disabled={!status}
            onClick={goNext}
            sx={{
              width: "100%",
              height: "55px",
              fontFamily: "medium",
              backgroundColor: status ? "#01144f" : "#c2c2c2",
              fontSize: "20px",
              mt: 50,
              transition: "all 0.3s ease",
              "&:hover:not(:disabled)": {
                backgroundColor: "#012a7a",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(1, 20, 79, 0.3)",
              },
              "&:active:not(:disabled)": {
                transform: "translateY(0)",
              },
            }}
          >
            ادامه
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
