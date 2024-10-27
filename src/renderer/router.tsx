import {createHashRouter} from "react-router-dom";
import Layout from "./routes/Layout";
import ServerList from "./routes/ServerList";
import ServerDetails from "./routes/ServerDetails";
import Settings from "./routes/Settings";
import About from "./routes/About";

const router = createHashRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "",
                element: <ServerList/>,
            },
            {
                path: "servers/:id",
                element: <ServerDetails/>,
            },
            {
                path: "settings",
                element: <Settings/>,
            },
            {
                path: "about",
                element: <About/>,
            },
        ]
    },
]);

export default router;