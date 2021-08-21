const loginBtn = document.querySelector("#login-button")
const userInput = document.querySelector("#user-name-input")
const loginMsg = document.querySelector("#login-msg")

const updateLoginMsg = (msg, status) => {
	loginMsg.textContent = msg
	loginMsg.classList.add(status)
	document.querySelector("#login-container").classList.remove("hidden")

	if (status === "success") {
		document.querySelector("#button-container").classList.add("hidden")
		userInput.classList.add("hidden")
	}
}

loginBtn.addEventListener("click", async () => {
	const successMsg = "Success. You are now logged in."
	let errMsg
	let userId

	try {
		const userGetRes = await fetch(`/users/name/${userInput.value}`)

		if (userGetRes.status !== 200) {
			errMsg = "Invalid login. Please try again."
			throw new Error(errMsg)
		}
	
		const userData = await userGetRes.json()
		userId = userData.result.id

		try {
			const userPutRes = await fetch("/users", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: userId,
					updates: {
						loggedIn: true
					}
				})
			})

			if (userPutRes.status !== 200) {
				errMsg = "Something went wrong. Please try again."
				throw new Error(errMsg)
			}

			updateLoginMsg(successMsg, "success")
		} catch (err) {
			console.log("Throwing error", errMsg)
			updateLoginMsg(errMsg, "error")
		}
	} catch (err) {
		console.log("Throwing error", errMsg)
		updateLoginMsg(errMsg, "error")
	}
})
