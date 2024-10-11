import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client
import App from "./App";
import { AuthProvider } from "./Contexts/authContext";
import { PlantProvider } from "./Contexts/plantContext";
import store from './redux/store'
import { Provider } from 'react-redux'

// Get the root element
const container = document.getElementById("app");
const root = createRoot(container!); // Create a root

// Render the App inside the AuthProvider
root.render(
  <React.StrictMode>
    <Provider store={store}>
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
    </Provider>
  </React.StrictMode>
);