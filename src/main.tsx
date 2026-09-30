import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { NetworkDataProvider } from "./context/NetworkDataContext";
import { ChatProvider } from "./context/ChatContext";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <NetworkDataProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </NetworkDataProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
