const searchBtn = document.querySelector("#search")
const tweetsContainer = document.querySelector("#tweets-list")

const getTweets = async (searchTerm) => {
	//NOTE: Add try/catch/finally
	tweetsContainer.innerHTML = ""
	const response = await fetch(`/tweets?text=${searchTerm}`)

	if (response.status === 204) {
		console.log("No tweets.")
		return document.querySelector("#total-tweets").textContent = "No"
	}

	const data = await response.json()
	const tweets = data.results

	console.log(`${tweets.length} tweets found.`)

	document.querySelector("#total-tweets").textContent = tweets.length

	let text = ""

	tweets.forEach(tweet => {
		const url = `<li><a href="/tweet/${tweet.id}">${tweet.text}</a></li>`
		text = text + url
	})

	tweetsContainer.innerHTML = text
}

searchBtn.addEventListener("click", () => {
	const searchTerm = document.querySelector("#search-input").value.trim()

	if (!searchTerm) {
		return alert("Please enter a search term.")
	}

	getTweets(searchTerm)

	document.querySelector("#search-input").value = ""
})