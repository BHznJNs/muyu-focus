import switchToTab from "./tabsController.js"

const duration = document.querySelector("#result-duration")
const soundCount = document.querySelector("#sound-count")

document
    .querySelector("#return")
    .addEventListener("click", () =>
        switchToTab("countdown"))

export const setDuration = timeValue => duration.value = timeValue
export const setSoundCount = count => soundCount.textContent = count
