import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ShoppingListContextProvider } from "./context/ShoppingListContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ShoppingListContextProvider>
        <App />
      </ShoppingListContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
