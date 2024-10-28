import {app, protocol} from "electron";

const protocolScheme = "gmp";

export function initProtocolHandler() {
    if (app.isPackaged) {
        app.setAsDefaultProtocolClient(protocolScheme);
        console.log("custom protocol exe set to", process.execPath);
    }

    app.whenReady().then(() => {
        protocol.handle(protocolScheme, (request) => {
            const { pathname } = new URL(request.url);
            const connectParam = "connect/";
            if (pathname.startsWith(connectParam)) {
                const connectTo = pathname.slice(connectParam.length);
                console.log('protocol', connectTo);
                return new Response(connectTo, {
                    status: 201,
                    headers: { 'content-type': 'text/html' }
                })
            }

            console.error('protocol error');
            return new Response(null, {
                status: 400,
            })
        });
    })
}