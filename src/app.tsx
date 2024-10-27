import "./styles/index.scss"
import { createRoot } from 'react-dom/client';
import {RouterProvider} from "react-router-dom";
import React from 'react';
import router from "./router";

const root = createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);