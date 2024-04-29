class TimeValue {
    hour = 0
    minute = 0
    second = 0

    constructor({hour=0, minute=0, second=0}) {
        typeof hour === "string" && (hour = parseInt(hour))
        typeof minute === "string" && (minute = parseInt(minute))
        typeof second === "string" && (second = parseInt(second))

        if (second > 60) {
            minute += parseInt(second / 60)
            second = second % 60
        }
        if (minute > 60) {
            hour += parseInt(minute / 60)
            minute = minute % 60
        }
        if (hour > 60) hour = 60

        this.hour = hour
        this.minute = minute
        this.second = second
    }

    isZeroTime() {
        return this.hour === 0
            && this.minute === 0
            && this.second === 0
    }

    passHour() {
        if (this.hour > 0) {
            this.hour -= 1
            return true
        }
        return false
    }
    passMinute() {
        if (this.minute > 0) {
            this.minute -= 1
            return true
        }
        const hasMoreTime = this.passHour()
        hasMoreTime && (this.minute = 59)
    }
    passSecond() {
        if (this.second > 0) {
            this.second -= 1
            return
        }
        const hasMoreTime = this.passMinute()
        hasMoreTime && (this.second = 59)
    }

    static fromString(timeString) {
        const [hour, minute, second] = timeString
            .split(":")
            .map(str =>
                parseInt(str))
        return new TimeValue({hour, minute, second})
    }
}

export default TimeValue
