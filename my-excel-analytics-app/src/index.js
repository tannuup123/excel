import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom"; // ✅ Import BrowserRouter
import { DarkModeProvider } from './contexts/DarkModeContext'; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <DarkModeProvider>
    <BrowserRouter>
      {/* {" "} */}
      <App />
    </BrowserRouter>
    </DarkModeProvider>
  </React.StrictMode>
);

// Optional performance measuring
reportWebVitals();
