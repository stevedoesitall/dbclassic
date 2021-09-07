(async () => {
	const sessionId = localStorage.getItem("sessionId")
	const response = await fetch(`/favorites/${sessionId}?type=session`)

	if (response.status === 204 || response.status === 404) {
		return console.log("No tweets.")
	}

	const data = await response.json()

	if (data.results.length) {
		data.results.forEach(tweet => {
			console.log(tweet)
		})
	}
})()