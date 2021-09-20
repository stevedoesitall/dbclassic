const loginBtn = document.querySelector("#login-button")
const userNameInput = document.querySelector("#user-name-input")
const passwordInput = document.querySelector("#password-input")
const loginMsg = document.querySelector("#login-msg")
const showPasswordButtons = document.querySelectorAll(".show-password-button")

const updateLoginMsg = (msg, status) => {
	loginMsg.textContent = msg
	loginMsg.classList.add(status)
	document.querySelector("#status-container").classList.remove("hidden")

	if (status === "success") {
		document.querySelector("#login-inputs").classList.add("hidden")
		document.querySelector("#login-container").classList.add("hidden")
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
				userName: userNameInput.value,
				password: passwordInput.value
			})
		})

		if (!response.ok) {
			if (response.status === 401) {
				errMsg = "Incorrect password."
			} else if (response.status === 404) {
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

showPasswordButtons.forEach(button => {
	button.addEventListener("click", (e) => {
		if (e.target.textContent === "Show") {
			e.target.textContent = "Hide"
			button.previousElementSibling.type = "text"
		} else {
			e.target.textContent = "Show"
			button.previousElementSibling.type = "password"
		}
	})
})