import { Box, ButtonBase, Switch, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const Source = ({
  title,
  description,
  logo,
  imageFilters,
  imgWidth,
  imgHeight,
  isEnabled,
  extraStyles,
  enablePopulate,
}) => {
  const theme = useTheme();
  const [enabled, setEnabled] = useState(isEnabled);

  const client = axios.create({
    baseURL:
      "http://ec2-18-193-111-68.eu-central-1.compute.amazonaws.com:8080/",
    withCredentials: false,
  });

  const handleSelected = () => {
    setEnabled((value) => !value);
  };

  useEffect(() => {
    if (enabled && enablePopulate) {
      client
        .get("populate")
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [enabled]);

  return (
    <ButtonBase onClick={handleSelected} sx={{ textAlign: "left" }}>
      <Box
        sx={{
          border: "1px solid ".concat(theme.palette.primary.light),
          borderRadius: "5px",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          paddingLeft: "1rem",
          paddingRight: "0.5rem",
          ...extraStyles,
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.primary.light }}>
          {/* {title} */}
          <img
            style={{
              // height: "30px",
              // width: "105px",
              width: imgWidth,
              height: imgHeight,
              //float: "right",
              marginRight: "1rem",
              marginTop: "0.5rem",
              filter: imageFilters,
            }}
            src={logo}
          />
          <Switch
            sx={{
              float: "right",
              marginTop: "-0.2rem",
              "& + .MuiSwitch-track": {
                color: "#fff",

                backgroundColor: "#2ECA45",
                opacity: 1,
                border: 0,
              },
              "& .MuiSwitch-track": {
                borderRadius: 26 / 2,
                backgroundColor:
                  theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
                opacity: 1,
                transition: theme.transitions.create(["background-color"], {
                  duration: 500,
                }),
              },
            }}
            color="info"
            size="small"
            checked={enabled}
            value={enabled}
            onChange={(event) => {
              setEnabled(event.target.checked);
            }}
          />
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.primary.light,
            fontSize: "0.8rem",
            fontWeight: "300",
          }}
        >
          {description}
        </Typography>
      </Box>
    </ButtonBase>
  );
};

export default Source;
