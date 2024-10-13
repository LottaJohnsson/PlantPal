import React from "react";
import {createRoot} from "react-dom/client"; // Import createRoot from react-dom/client
import App from "./App";
import {PlantProvider} from "./Contexts/plantContext";
import store, {persistor} from './redux/store'
import {Provider} from 'react-redux'
import {PersistGate} from "redux-persist/integration/react";

// Get the root element
const container = document.getElementById("app");
const root = createRoot(container!); // Create a root

// Render the App inside the AuthProvider
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                    <PlantProvider>
                        <style>
                            {`
                body {
                    margin: 0;
                }
            `}
                        </style>
                        <App/>
                    </PlantProvider>

            </PersistGate>
        </Provider>
    </React.StrictMode>
)
;