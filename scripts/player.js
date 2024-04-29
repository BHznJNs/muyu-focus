async function loadAudioFile(url) {
    const audioBuffer = await fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
    return audioBuffer
}

const audioCtx = new AudioContext()
const audioMap = new Map([
    ["muyu", await loadAudioFile("./assets/muyu.mp3")],
    ["drops", await loadAudioFile("./assets/drops.mp3")],
    ["pendulum", await loadAudioFile("./assets/pendulum.mp3")],
    ["book", await loadAudioFile("./assets/book.mp3")],
])

function play() {
    const targetBuffer = audioMap.get(globalThis.__CurrentSoundName__)
    const sourceNode = audioCtx.createBufferSource()
    sourceNode.buffer = targetBuffer
    sourceNode.connect(audioCtx.destination)
    sourceNode.start(audioCtx.currentTime)
}

function createPlayLoop() {
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    const loopGap = () => randomInt(1800, 4800)

    let timer = null
    let loopCount = 0
    function loop() {
        play()
        loopCount += 1
        timer = setTimeout(loop, loopGap())
    }
    setTimeout(loop, randomInt(500, 2000))

    const resume = () => loop()
    const stop = () => clearTimeout(timer)

    return {
        resume, stop,
        count: () => loopCount,
    }
}

export default createPlayLoop
