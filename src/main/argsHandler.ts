import {addFavoriteServer, mainWindow} from "./main";
import {isHttpUrlValid} from "./util";

export async function handleArgs(argv: string[]) {
    console.log("available argv: ", argv);
    for (const arg of argv) {
        if (arg.startsWith("--add-server=")) {
            await addServerAndShow(arg.split("=")[1]);
        } else if (arg.startsWith("gmp://add-server/")) {
            await addServerAndShow(decodeURIComponent(arg.slice("gmp://add-server/".length)));
        }
    }
}

async function addServerAndShow(url: string) {
    if (isHttpUrlValid(url)) {
        await addFavoriteServer(url);
        mainWindow.webContents.send("show-server", url);
    }
}
