import el from "./el.js"

function addZero(number) {
    if (typeof number === "number") {
        number = number.toString()
    }
    if (number.length < 2) {
        return "0" + number
    }
    return number
}

const timePicker = document.querySelector("#time-picker-dialog")

class CountDown extends HTMLElement {
    constructor() {
        super()

        timePicker.value = {minute: 1}
        this.mount()
        this.renderTime({minute: 1})
        this.addEventListener("click", () => timePicker.showModal())
        timePicker.subcribe(val => this.renderTime(val))
    }

    mount() {
        const fragment = document.createDocumentFragment()
        this.hour = el("span", "", { "class": "hour" })
        this.minute = el("span", "", { "class": "minute" })
        this.second = el("span", "", { "class": "second" });
        [this.hour, el("text", ":"), this.minute, el("text", ":"), this.second]
            .forEach(node => fragment.appendChild(node))
        this.appendChild(fragment)
    }

    renderTime({hour=0, minute=0, second=0}) {
        this.hour.textContent = addZero(hour)
        this.minute.textContent = addZero(minute)
        this.second.textContent = addZero(second)
    }

    set value(timeObj) {
        timePicker.value = timeObj
        this.renderTime(timeObj)
    }
    get value() {
        return timePicker.value
    }
}

customElements.define("count-down", CountDown)
