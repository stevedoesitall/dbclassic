(async () => {
	const userId = localStorage.getItem("userId")
	const response = await fetch(`/favorites/${userId}`)

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