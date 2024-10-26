import { StrictMode } from "react";

import "./index.css";
import { Header } from "./widgets/header/ui/Header.tsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/app.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <Header />
      {/* <MainPage /> */}
      <App />
    </StrictMode>
  </BrowserRouter>
);
