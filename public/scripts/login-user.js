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
		const loginUser = await fetch("/admin/login/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				userName: userNameInput.value
			})
		})

		const loginUserRes = await loginUser.json()
		const sessionId = loginUserRes.sessionId

		localStorage.setItem("sessionId", sessionId)
		updateLoginMsg(successMsg, "success")

	} catch (err) {
		console.log("Throwing error", errMsg)
		updateLoginMsg(errMsg, "error")
	}

})
