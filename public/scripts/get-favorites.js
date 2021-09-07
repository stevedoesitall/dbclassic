(async () => {
	const sessionId = localStorage.getItem("sessionId")
	const response = await fetch(`/favorites/${sessionId}?type=session`)

	if (response.status === 204 || response.status === 404) {
		return console.log("No tweets.")
	}

	const data = await response.json()
	const tweets = data.results
	
	if (tweets.length) {
		const favoritesContainer = document.querySelector("#favorites-section")
		const favoritesList = document.querySelector("#favorites-list")
		let text = ""

		favoritesContainer.classList.remove("hidden")

		tweets.forEach((tweet) => {
			const url = `<li><a href="/tweet/${tweet.id}">${tweet.text}</a></li>`
			text = text + url
		})
	
		favoritesList.innerHTML = text
	}
})()