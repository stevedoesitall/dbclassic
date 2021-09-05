const getTweets = async () => {
	const userId = localStorage .getItem("userId")
	const response = await fetch(`/favorites/${userId}`)
	if (response.status === 204) {
		console.log("No tweets.")
	}

	const data = await response.json()

	console.log(data.results)
}

getTweets()