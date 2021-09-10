const loginBtn = document.querySelector("#login-button")
const userNameInput = document.querySelector("#user-name-input")
const loginMsg = document.querySelector("#login-msg")

const updateLoginMsg = (msg, status) => {
	loginMsg.textContent = msg
	loginMsg.classList.add(status)
	document.querySelector("#login-container").classList.remove("hidden")

	if (status === "success") {
		document.querySelector("#button-container").classList.add("hidden")
		userNameInput.classList.add("hidden")
	}
}

loginBtn.addEventListener("click", async () => {
	const successMsg = "Success. You are now logged in."
	let errMsg

	try {
		const response = await fetch("/admin/login/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				userName: userNameInput.value
			})
		})

		if (!response.ok) {
			let errMsg
			if (response.status === 401) {
				errMsg = "Username does not exist."
			}

			throw new Error(errMsg)
		}

		const data = response.json()
		const sessionId = data.sessionId

		localStorage.setItem("sessionId", sessionId)
		updateLoginMsg(successMsg, "success")

	} catch (err) {
		updateLoginMsg(err, "error")
	}
})
