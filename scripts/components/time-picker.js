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
    const selectedItem = this.querySelector("." + selectorPattern)
    if (selectedItem) {
        selectedItem.classList.remove(selectorPattern)
    }
    e.target.classList.add(selectorPattern)
}

const selectorPattern = "selected"

class TimePicker extends HTMLDialogElement {
    #eventList = []

    constructor() {
        super()
        this.mount()
        this.appendEvent()
    }

    subcribe(event) {
        if (this.#eventList.includes(event)) {
            return
        }
        this.#eventList.push(event)
    }

    mount() {
        this.hourArea   = el("div", timeItemListFactory(), {"class": "time-picker-hour no-scroll"})
        this.minuteArea = el("div", timeItemListFactory(), {"class": "time-picker-minute no-scroll"})
        this.secondArea = el("div", timeItemListFactory(), {"class": "time-picker-second no-scroll"})
        this.hourArea  .addEventListener("click", timeSelectHandler)
        this.minuteArea.addEventListener("click", timeSelectHandler)
        this.secondArea.addEventListener("click", timeSelectHandler)
        this.confirmBtn = el("button", "确定")
        this.cancelBtn  = el("button", "取消")
        const actions   = el("div", [this.confirmBtn, this.cancelBtn], {"class": "actions"})

        const container = el("div",
            [this.hourArea, this.minuteArea, this.secondArea, actions],
            { "class": "time-picker-container" },
        )
        this.appendChild(container)
    }

    appendEvent() {
        this.cancelBtn.addEventListener("click", () => this.close())
        this.confirmBtn.addEventListener("click", () => {
            this.#eventList.forEach(event => event(this.value))
            this.close()
        })
    }

    set value(timeValue) {
        if (!(timeValue instanceof TimeValue)) {
            timeValue = new TimeValue(timeValue)
        }

        const {hour, minute, second} = timeValue

        for (const area of [this.hourArea, this.minuteArea, this.secondArea]) {
            const selectedItem = area.querySelector("." + selectorPattern)
            if (selectedItem) {
                selectedItem.classList.remove(selectorPattern)
            }
        }
        this.hourArea.childNodes[hour].classList.add(selectorPattern)
        this.minuteArea.childNodes[minute].classList.add(selectorPattern)
        this.secondArea.childNodes[second].classList.add(selectorPattern)
    }

    get value() {
        const timeList = [this.hourArea, this.minuteArea, this.secondArea].map(area => {
            const selectedItem = area.querySelector("." + selectorPattern)
            return selectedItem ? selectedItem.textContent : 0
        })
        const [hour, minute, second] = timeList
        return new TimeValue({hour, minute, second})
    }
}

customElements.define("time-picker", TimePicker, {
    extends: "dialog",
})
