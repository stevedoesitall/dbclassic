const favoriteButtons = document.querySelectorAll(".favorite-button")

favoriteButtons.forEach(button => {
	button.addEventListener("click", async (event) => {
		const tweetId = event.target.id.substring(4)
		const buttonClasses = [...event.target.classList]
		const isFavorite = buttonClasses.includes("is-fav-false") ? false : true
		let method

		if (isFavorite) {
			method = "DELETE"
		} else {
			method = "POST"
		}

		const response = await fetch("/favorites", {
			method: method,
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				tweetId: tweetId
			})
		})

		const data = await response.json()
		
		if (data.ok) {
			if (isFavorite) {
				button.innerText = "Add Favorite"
				button.classList.add("is-fav-false")
				button.classList.remove("is-fav-true")
			} else {
				button.innerText = "Remove Favorite"
				button.classList.add("is-fav-true")
				button.classList.remove("is-fav-false")
			}
	
		} else {
			alert("Something went wrong.")
		}
	})
})