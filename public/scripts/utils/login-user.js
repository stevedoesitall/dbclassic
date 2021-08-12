const loginBtn = document.querySelector("#login-button")
const userInput = document.querySelector("#user-name-input")
const loginMsg = document.querySelector("#login-msg")

const updateLoginMsg = (msg, status) => {
	loginMsg.textContent = msg
	loginMsg.classList.add(status)

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
		const userData = await userGetRes.json()
		userId = userData.id

		document.querySelector("#login-container").classList.remove("hidden")

		if (userGetRes.status !== 200) {
			errMsg = "Invalid login. Please try again."
			throw new Error(errMsg)
		}

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
		}

		catch(err) {
			updateLoginMsg(errMsg, "error")
		}

	} catch(err) {
		updateLoginMsg(errMsg, "error")
	}

})