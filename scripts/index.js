import "./soundSwitcher.js"
import "./timeResolver.js"
import "./countdownController.js"
import "./components/time-picker.js"
import "./components/count-down.js"

if ("serviceWorker" in navigator) {
    // if support service worker, register
    navigator.serviceWorker
        .register("../sw.js")
        .catch(err =>
            // registration failed
            console.error("Registration failed with " + err))
}
