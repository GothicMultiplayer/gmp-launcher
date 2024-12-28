import {app, protocol} from "electron";
import {mainWindow} from "./main";

const protocolScheme = "gmp";

export function initProtocolHandler() {
    if (app.isPackaged) {
        app.setAsDefaultProtocolClient(protocolScheme);
        console.log("custom protocol exe set to", process.execPath);
    }

    app.whenReady().then(() => {
        protocol.handle(protocolScheme, (request) => {
            const { host, pathname } = new URL(request.url);
            if (host === "connect") {
                const connectTo = decodeURIComponent(pathname.slice("/".length));
                console.log('protocol', connectTo);
                if (isHttpUrlSafe(connectTo)) {
                    mainWindow.webContents.send("connect", connectTo);
                    return new Response(null, {
                        status: 201,
                    });
                }
            }

            console.error('protocol error');
            return new Response(null, {
                status: 400,
            })
        });
    })
}

function isHttpUrlSafe(str: string): boolean {
    const url = URL.parse(str);
    return url?.protocol === 'https:' || url?.protocol === 'http:';
}
