function adjustVH_VW() {
    const scaleFactor = 100 / (window.devicePixelRatio * 100); 
    const correctedScale = 1 / scaleFactor; // Umkehrung der Skalierung
    const userAgent = navigator.userAgent.toLowerCase();
    const isFirefox = userAgent.includes("firefox");

    if (scaleFactor < 1) {
        if (isFirefox) {
            document.body.style.transform = `scale(${scaleFactor})`;
            document.body.style.transformOrigin = "top left";
            document.body.style.width = `${100 / scaleFactor}%`;
            document.body.style.height = `${100 / scaleFactor}%`;
        } else {
            document.body.style.zoom = scaleFactor;
        }

        // Korrigierte vh und vw setzen
        document.documentElement.style.setProperty("--vh", `${window.innerHeight * correctedScale}px`);
        document.documentElement.style.setProperty("--vw", `${window.innerWidth * correctedScale}px`);
    } else {
        document.body.style.transform = "";
        document.body.style.zoom = "";
        document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
        document.documentElement.style.setProperty("--vw", `${window.innerWidth}px`);
    }
}
window.addEventListener("resize", adjustVH_VW);
window.addEventListener("load", adjustVH_VW);