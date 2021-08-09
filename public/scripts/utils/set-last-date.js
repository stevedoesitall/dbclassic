const footer = document.querySelector("#copyright-year")
const currentYear = new Date().getFullYear()
const dateRegex = /\/date\/[0-9]{4}-[0-9]{2}-[0-9]{2}$/
const currentPath = window.location.pathname

if (dateRegex.test(currentPath)) {
	const lastDate = window.location.pathname.substring(6)
	localStorage.setItem("lastDate", lastDate)
}

footer.textContent = currentYear