const logoutBtn = document.querySelector("#logout-button")
const loginMsg = document.querySelector("#login-msg")

const updateLoginMsg = (msg, status) => {
	loginMsg.textContent = msg
	loginMsg.classList.add(status)
}

logoutBtn.addEventListener("click", async () => {
	let errMsg

	try {
		const response = await fetch("/admin/logout/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		})

		const data = await response.json()

		if (!data.ok) {
			errMsg = data.error
			throw new Error(errMsg)
		}

		localStorage.removeItem("sessionId")
		location.href = "/"

	} catch (err) {
		updateLoginMsg(errMsg, "error")
	}
})