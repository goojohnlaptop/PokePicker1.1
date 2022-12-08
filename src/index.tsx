import * as React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { App } from "./App";
import theme from "./theme";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  // uri: "https://beta.pokeapi.co/graphql/v1beta",
  uri: "https://rickandmortyapi.com/graphql",
  cache: new InMemoryCache(),
});

const rootElement = document.getElementById("root");

const root = createRoot(rootElement!);

root.render(
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <CssBaseline />
      <App />
    </ApolloProvider>
  </ThemeProvider>
);
