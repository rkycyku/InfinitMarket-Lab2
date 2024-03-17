// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Navbar from "./NavBar";
import { BrowserRouter } from "react-router-dom";
import { TitleProvider } from "./Context/TitleProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <TitleProvider>
      <Navbar />
    </TitleProvider>
  </BrowserRouter>
);
