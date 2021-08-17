const selectedYear = document.querySelector("#year-select")
const backToTopBtn = document.querySelector("#back-to-top-button")
const jumpBtn = document.querySelector("#jump-button")

jumpBtn.addEventListener("click", () => {
	jumpBtn.setAttribute("href", `#day-${selectedYear.value}`)
})

document.addEventListener("scroll", () => {
	const LIMIT = 400
	const position = window.scrollY
	if (position > LIMIT) {
		backToTopBtn.classList.remove("hidden")
	} else {
		backToTopBtn.classList.add("hidden")
	}
})
