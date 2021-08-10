const loginBtn = document.querySelector("#login-button")

loginBtn.addEventListener("click", async () => {
	const userInput = document.querySelector("#user-name-input").value
	const response = await fetch(`/users/name/${userInput}`)

	if (response.status !== 200) {
		alert("Something went wrong. Please try again.")
	}
})