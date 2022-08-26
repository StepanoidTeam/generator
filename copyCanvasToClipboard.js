export function copyCanvasToClipboard(event) {
    const selectedCanvas = event.target;

    selectedCanvas.toBlob(function (blob) {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]);

        console.log("copied 📋");
    });
}
