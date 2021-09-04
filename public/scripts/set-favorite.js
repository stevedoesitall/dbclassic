const favoriteButtons = document.querySelectorAll(".favorite-button")

favoriteButtons.forEach(button => {
	button.addEventListener("click", async (event) => {
		const tweetId = event.target.id.substring(4)
		const buttonClasses = [...event.target.classList]
		const method = buttonClasses.includes("is-fav-false") ? "POST" : "DELETE"

		const response = await fetch("/favorites", {
			method: method,
			headers: {
				"Content-Type": "application/json"
			},
			body: ""
		})

		const data = await response.json()
		console.log(data)
	})
})