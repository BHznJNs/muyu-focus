import createPlayLoop from "./player.js"
import { setDuration, setSoundCount } from "./resultController.js"
import switchToTab from "./tabsController.js"

const timePicker = document.querySelector("#timer")
const countdownContainer = document.querySelector(".countdown")
const timeCandidates = countdownContainer.querySelector(".time-candidates")

let countdownOperator = null
let playLoopOperator = null

function getNow() {
    return document.timeline
        ? document.timeline.currentTime
        : performance.now()
}

function stop() {
    countdownContainer.classList.remove("started", "paused")
    countdownContainer.classList.add("ready")
    timeCandidates.childNodes.forEach(node => node.disabled = null)

    countdownOperator.stop()
    playLoopOperator.stop()
    // clear operators
    countdownOperator = null
    playLoopOperator = null
}

function countdown(tickCallback, stopCallback, endCallback) {
    let currentTimeValue = timePicker.value
    let timeout = null
    const start = getNow()
    const interval = 1000

    const resume = () => requestAnimationFrame(timer)
    const pause = () => clearTimeout(timeout)
    const stop = () => {
        clearTimeout(timeout)
        stopCallback()
    }

    function timer(time) {
        if (currentTimeValue.isZeroTime()) {
            endCallback()
            return
        }

        currentTimeValue.passSecond()
        tickCallback(currentTimeValue)

        const gap = time - start
        const gapSeconds = Math.round(gap / interval)
        const nextTime = start + (gapSeconds + 1) * interval
        const delay = getNow()

        timeout = setTimeout(() =>
            requestAnimationFrame(timer),
            nextTime - delay,
        )
    }
    requestAnimationFrame(timer)
    return {resume, pause, stop}
}

document
    .querySelector("#start")
    .addEventListener("click", () => {
    countdownContainer.classList.remove("paused")
    countdownContainer.classList.remove("ready")
    countdownContainer.classList.add("started")

    if (countdownOperator && playLoopOperator) {
        countdownOperator.resume()
        playLoopOperator.resume()
        return
    }
    timeCandidates.childNodes.forEach(node => node.disabled = true)

    countdownOperator = countdown(
        // update timePicker ui per tick
        countdownTime => timePicker.renderTime(countdownTime),
        // return timePicker ui when stopped
        () => timePicker.renderTime(timePicker.value),
        // when successfully finished countdown
        () => {
            setDuration(timePicker.value)
            setSoundCount(playLoopOperator.count())
            stop()
            switchToTab("result")
        },
    )
    playLoopOperator = createPlayLoop()
})

document
    .querySelector("#pause")
    .addEventListener("click", () => {
    countdownContainer.classList.remove("started")
    countdownContainer.classList.add("paused")

    countdownOperator.pause()
    playLoopOperator.stop()
})

document
    .querySelector("#stop")
    .addEventListener("click", stop)
