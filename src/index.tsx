import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
// import { Overview } from "./Overview";
import { UserStateProvider } from "./providers/UserStateProvider";
import { AuthProvider } from "./firebase/AuthProvider";
import { AllRoutes } from "./routing/AllRoutes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <AllRoutes />
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
