const soundList = ["muyu", "drops", "pendulum", "book"]

// save and read value
let currentSoundIndex = parseInt(localStorage.getItem("sound-index")) || 0
window.addEventListener("beforeunload", () =>
    localStorage.setItem("sound-index", currentSoundIndex))

const soundTag = document.querySelector("#current-sound")
const soundMap = new Map([
    ["muyu", "木鱼"],
    ["drops", "水滴"],
    ["pendulum", "钟摆"],
    ["book", "翻书"],
])

switchSound(soundList[0], soundList[currentSoundIndex])
globalThis.__CurrentSoundName__ = soundList[currentSoundIndex]

function switchSound(oldSoundName, newSoundName) {
    const targetClassList = document.body.classList
    const prefix = "sound-"
    targetClassList.replace(prefix + oldSoundName, prefix + newSoundName)
    globalThis.__CurrentSoundName__ = soundList[currentSoundIndex]
    soundTag.textContent = soundMap.get(soundList[currentSoundIndex])
}

document
.querySelector("#previous-sound")
.addEventListener("click", () => {
    const oldSoundName = soundList[currentSoundIndex]
    currentSoundIndex -= 1
    if (currentSoundIndex < 0) {
        currentSoundIndex = soundList.length - 1
    }
    const newSoundName = soundList[currentSoundIndex]
    switchSound(oldSoundName, newSoundName)
})

document
.querySelector("#next-sound")
.addEventListener("click", () => {
    const oldSoundName = soundList[currentSoundIndex]
    currentSoundIndex = (currentSoundIndex + 1) % soundList.length
    const newSoundName = soundList[currentSoundIndex]
    switchSound(oldSoundName, newSoundName)
})
