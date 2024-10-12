import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client
import App from "./App";
import { AuthProvider } from "./Contexts/authContext";
import { PlantProvider } from "./Contexts/plantContext";

// Get the root element
const container = document.getElementById("app");
const root = createRoot(container!); // Create a root

// Render the App inside the AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PlantProvider>
        <style>
            {`
                body {
                    margin: 0;
                }
            `}
        </style>
        <App />
      </PlantProvider>
    </AuthProvider>
  </React.StrictMode>
);