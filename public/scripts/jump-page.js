const selectedYear = document.querySelector("#year-select")

const jumpBtn = document.querySelector("#jump-button")
jumpBtn.addEventListener("click", () => {
	jumpBtn.setAttribute("href", `#day-${selectedYear.value}`)
})