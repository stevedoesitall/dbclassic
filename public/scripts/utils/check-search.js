import getTweets from "./get-tweets.js"

const searchBtn = document.querySelector("#search")

searchBtn.addEventListener("click", () => {
	const searchTerm = document.querySelector("#search-input").value.trim()

	if (!searchTerm) {
		return alert("Please enter a search term.")
	}

	getTweets(searchTerm)

	document.querySelector("#search-input").value = ""
})