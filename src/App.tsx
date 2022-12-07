import * as React from "react";
import Container from "@mui/material/Container";
import { Home } from "./pages/Home/Home";
import { Header } from "./components/Header";

export const App: React.FC = () => {
  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Home />
      </Container>
    </>
  );
};


