import TimeValue from "./timeValue.js"

const timePicker = document.querySelector("#timer")

document
    .querySelector(".time-candidates")
    .addEventListener("click", function(e) {
    if (e.target === this) {
        return
    }
    const targetTimeString = e.target.textContent
    const targetTimeValue = TimeValue.fromString(targetTimeString)
    timePicker.value = targetTimeValue
})
