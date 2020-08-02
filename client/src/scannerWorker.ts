import  jsQR  from 'jsqr'

declare function postMessage(message: any, transfer?: any[]): void;

self.addEventListener("message", e => {
    const image = e.data.image;

    let code = jsQR(image.data, image.width, image.height, {
        inversionAttempts: "dontInvert",
    });
    if (code !== null)
        postMessage(code.data);
});