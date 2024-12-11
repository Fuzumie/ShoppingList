import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ShoppingListProvider } from "./context/ShoppingListContext";
import "./styles/base.css"
import "./styles/themes.css"
import "./styles/buttons.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ShoppingListProvider>
        <App/>
      </ShoppingListProvider>
    </AuthContextProvider>
  </React.StrictMode>
);