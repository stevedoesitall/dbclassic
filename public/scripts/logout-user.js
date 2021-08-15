const logoutBtn = document.querySelector("#logout-button")
const loginMsg = document.querySelector("#login-msg")

const updateLoginMsg = (msg, status) => {
	loginMsg.textContent = msg
	loginMsg.classList.add(status)
}

logoutBtn.addEventListener("click", async () => {
	let errMsg
    
	try {
		const userId = location.pathname.substring(9)
		console.log(userId)
		const userPutRes = await fetch("/users", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id: userId,
				updates: {
					loggedIn: false
				}
			})
		})

		if (userPutRes.status !== 200) {
			errMsg = "Something went wrong when trying to log out; please try again later."
			throw new Error(errMsg)
		}

		location.href = "/"

	} catch(err) {
		updateLoginMsg(errMsg, "error")
	}
})