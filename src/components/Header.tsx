import React, { useCallback } from "react";
import { Box, Button, Link, Typography } from "@mui/material";
import Logo from "../assets/logo.webp";

const styles = {
  container: {
    height: 76,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "#96979833",
    borderWidth: 1,
    borderStyle: "solid",
  },
  logoBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
};

export const Header: React.FC = () => {
  const goHome = () => {
    const win: Window = window;
    win.location = "/";
  };

  return (
    <Box px={4.5} py={2} mx={4} my={4} sx={styles.container}>
      <Box sx={styles.logoBox}>
        <Link component="button" onClick={goHome}>
          <img
            height="60px"
            src={Logo}
            alt="Poke Logo"
          />
        </Link>
        <Typography ml={2.2} variant="h4" >
            PokePicker
        </Typography>
      </Box>
        <Link
          href="#"
          onClick={goHome}
          mr={4}
          color="linkColor.main"
          underline="none"
          variant="h6"
        >
          Home
        </Link>
    </Box>
  );
};
