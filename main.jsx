import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { Admin } from "./Admin.jsx";
import "./styles.css";

function currentRoute() {
  return window.location.hash.replace(/^#\/?/, "").toLowerCase();
}

function Root() {
  const [route, setRoute] = useState(currentRoute());
  useEffect(() => {
    const onHash = () => setRoute(currentRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route === "admin" ? <Admin /> : <App />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
