import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminContextProvider from "./context/AdminContext";
import AppContextProvider from "./context/AppContext"; // ✅ Import it
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ✅ Wrap AppContextProvider OUTSIDE of AdminContextProvider */}
      <AppContextProvider>
        <AdminContextProvider>
          <App />
        </AdminContextProvider>
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
