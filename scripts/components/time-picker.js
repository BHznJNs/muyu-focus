import el from "./el.js"
import TimeValue from "../timeValue.js"

function timeItemListFactory() {
    const timeItem = index => el("div", index.toString(), {"class": "time-picker-item"})
    const itemList = []
    for (let i=0; i<=60; i++) {
        itemList.push(timeItem(i))
    }
    return itemList
}

function timeSelectHandler(e) {
    if (e.target === this) {
        return
    }
    const selectedItem = this.querySelector(".selected")
    if (selectedItem) {
        selectedItem.classList.remove(selectorPattern)
    }
    e.target.classList.add(selectorPattern)
}

function addZero(number) {
    if (typeof number === "number") {
        number = number.toString()
    }
    if (number.length < 2) {
        return "0" + number
    }
    return number
}

const selectorPattern = "selected"
const hourArea = el("div", timeItemListFactory(), {"class": "time-picker-hour no-scroll"})
const minuteArea = el("div", timeItemListFactory(), {"class": "time-picker-minute no-scroll"})
const secondArea = el("div", timeItemListFactory(), {"class": "time-picker-second no-scroll"})
hourArea.addEventListener("click", timeSelectHandler)
minuteArea.addEventListener("click", timeSelectHandler)
secondArea.addEventListener("click", timeSelectHandler)

const confirmBtn = el("button", "确定")
const cancelBtn = el("button", "取消")
const actions = el("div", [confirmBtn, cancelBtn], {"class": "time-picker-actions"})

const dialogEl = el("dialog",
    el("div", [hourArea, minuteArea, secondArea, actions], {
        "class": "time-picker-container"
    }),
    {id: "time-picker-dialog"},
)

document.body.appendChild(dialogEl)

function setTimeValue(timeObj) {
    const {hour, minute, second} = new TimeValue(timeObj)

    for (const area of [hourArea, minuteArea, secondArea]) {
        const selectedItem = area.querySelector("." + selectorPattern)
        if (selectedItem) {
            selectedItem.classList.remove(selectorPattern)
        }
    }
    hourArea.childNodes[hour].classList.add(selectorPattern)
    minuteArea.childNodes[minute].classList.add(selectorPattern)
    secondArea.childNodes[second].classList.add(selectorPattern)
}

function getTimeValue() {
    const timeList = [hourArea, minuteArea, secondArea].map(area => {
        const selectedItem = area.querySelector("." + selectorPattern)
        return selectedItem ? selectedItem.textContent : 0
    })
    const [hour, minute, second] = timeList
    return new TimeValue({hour, minute, second})
}

class TimePicker extends HTMLElement {
    constructor() {
        super()

        setTimeValue({minute: 1})
        this.mount()
        this.renderTime({minute: 1})
        this.addEventListener("click", () => dialogEl.showModal())
        cancelBtn.addEventListener("click", () => dialogEl.close())
        confirmBtn.addEventListener("click", () => {
            const timeValue = getTimeValue()
            dialogEl.close()
            this.renderTime(timeValue)
        })
    }

    mount() {
        const fragment = document.createDocumentFragment()
        this.hour = el("span", "", { "class": "hour" })
        this.minute = el("span", "", { "class": "minute" })
        this.second = el("span", "", { "class": "second" })
        fragment.appendChild(this.hour)
        fragment.appendChild(el("text", ":"))
        fragment.appendChild(this.minute)
        fragment.appendChild(el("text", ":"))
        fragment.appendChild(this.second)
        this.appendChild(fragment)
    }

    renderTime({hour=0, minute=0, second=0}) {
        this.hour.textContent = addZero(hour)
        this.minute.textContent = addZero(minute)
        this.second.textContent = addZero(second)
    }

    set value(timeObj) {
        setTimeValue(timeObj)
        this.renderTime(timeObj)
    }
    get value() {
        return getTimeValue()
    }
}

customElements.define("time-picker", TimePicker)
