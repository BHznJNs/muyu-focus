const tabsContainer = document.querySelector(".tabs")

let currentTabName = "countdown"

export default function switchToTab(tabName) {
    const targetClassList = tabsContainer.classList
    const prefix = "show-"
    targetClassList.replace(prefix + currentTabName, prefix + tabName)
    currentTabName = tabName
}
