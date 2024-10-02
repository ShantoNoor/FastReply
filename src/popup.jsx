import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/ui/theme-provider";
import Main from "./layout/Main";
import { MemoryRouter } from "react-router-dom";
import DataProvider from "./components/DataProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider
      defaultTheme="dark"
      attribute="class"
      storageKey="vite-ui-theme"
    >
      <DataProvider>
        <MemoryRouter>
          <Main />
        </MemoryRouter>
      </DataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
