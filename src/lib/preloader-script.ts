export const PRELOADER_KEY = "preloader-seen";
export const PRELOADER_ATTR = "data-preloader-seen";

// Runs in <head> before first paint, so a repeat visit never shows the overlay.
export const preloaderScript = `try{if(sessionStorage.getItem("${PRELOADER_KEY}"))document.documentElement.setAttribute("${PRELOADER_ATTR}","")}catch(e){}`;
