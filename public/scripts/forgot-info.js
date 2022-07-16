const ctaButtons = document.querySelectorAll(".cta-button")
const emailMessage = document.querySelector("#email-message")
const errorMessage = document.querySelector("#error-message")
const emailInput = document.querySelector("#email-input")
const buttonContainer = document.querySelector("#button-container")
const refreshLink = document.querySelector("#refresh-link")
const validateEmail = (email) => {
	const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regex.test(email.toLowerCase())
}

let emailIsValid = false

window.onload = () => {
	emailInput.value = ""
}

emailInput.addEventListener("keyup", async () => {
	if (emailInput.value.length < 3) {
		return errorMessage.classList.add("hidden")
	} 

	errorMessage.classList.remove("hidden")

	if (!validateEmail(emailInput.value)) {
		errorMessage.textContent = "Invalid email address"
		errorMessage.classList.remove("hidden")
		emailIsValid = false
	} else {
		errorMessage.classList.add("hidden")
		emailIsValid = true
	}
})

ctaButtons.forEach(button => {
	button.addEventListener("click", async (e) => {
		const emailValue = emailInput.value

		if (!emailIsValid) {
			emailInput.classList.add("required")
			errorMessage.classList.remove("hidden")
		}

		if (emailValue) {
			const type = e.target.id
			refreshLink.classList.remove("hidden")
			buttonContainer.classList.add("hidden")
			emailInput.classList.add("hidden")

			const response = await fetch("/admin/reset/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					type,
					email: emailInput.value
				})
			})

			if (response.ok) {
				emailMessage.classList.remove("hidden")
				if (type === "send-username") {
					emailMessage.textContent += " with your username shortly."
				} else if (type === "reset-password") {
					emailMessage.textContent += " to reset your password shortly."
				}
			} else {
				errorMessage.classList.remove("hidden")
				errorMessage.textContent = "Something went wrong. Please try again later."
			}
		}
	})
})