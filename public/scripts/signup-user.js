const signupBtn = document.querySelector("#signup-button")
const userNameInput = document.querySelector("#user-name-input")
const passwordInput = document.querySelector("#password-input-1")
const confirmPasswordInput = document.querySelector("#password-input-2")
const allPasswordReqs = document.querySelectorAll(".pass-req")
const showPasswordButtons = document.querySelectorAll(".show-password-button")
const signupMessage = document.querySelector("#signup-msg")
const statusContainer = document.querySelector("#status-container")
const passwordMessage = document.querySelector("#password-message")
const passwordRequirementsObj = {
	"pass-len": {
		func: (val) => val.length >= 8 && val.length <= 40,
		status: false
	},
	"pass-lower" : {
		func: (val) => /[a-z]/.test(val),
		status: false
	},
	"pass-upper": {
		func: (val) => /[A-Z]/.test(val),
		status: false
	},
	"pass-num": {
		func: (val) => /[0-9]/.test(val),
		status: false
	},
	"pass-spec": {
		func: (val) => /[@&$!#?]/.test(val),
		status: false
	}
}

let userNameIsValid = false
let passwordIsValid = false

const updateStatus = (el, add, remove) => {
	el.classList.add(add)
	el.classList.remove(remove)
}

const inputIds = Object.keys(passwordRequirementsObj)

const checkIfPasswordIsValid = () => {
	return Object.values(passwordRequirementsObj).every(val => val.status === true)
}

const checkIfPasswordMatch = () => {
	const passwordLength = passwordInput.value.length
	const confirmPasswordLength = confirmPasswordInput.value.length
	confirmPasswordInput.classList.remove("required")
	
	if (confirmPasswordLength && passwordLength) {
		console.log("Checking...")

		passwordMessage.classList.remove("hidden")
		if (confirmPasswordInput.value === passwordInput.value) {
			passwordMessage.textContent = "Passwords match"
			updateStatus(passwordMessage, "success", "error")
		} else {
			passwordMessage.textContent = "Passwords don't match"
			updateStatus(passwordMessage, "error", "success")
		}
	} else {
		passwordMessage.classList.add("hidden")
	}
}

// const checkIfPasswordIsValid = () => {
// 	return Object.values(passwordRequirementsObj).some(val => val.status === false)
// }

let successCount = 0

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

userNameInput.addEventListener("keyup", async () => {
	userNameInput.classList.remove("required")
	const userNameMessage = document.querySelector("#user-name-message")

	if (userNameInput.value.length < 3) {
		userNameIsValid = false
		return userNameMessage.classList.add("hidden")
	} 
    
	userNameMessage.classList.remove("hidden")

	const response = await fetch("/admin/user?name=" + userNameInput.value)

	if (response.status === 204) {
		userNameMessage.textContent = "Username available"
		updateStatus(userNameMessage, "success", "error")
		userNameIsValid = true
	} else if (response.status === 200) {
		userNameMessage.textContent = "Username unavailable"
		updateStatus(userNameMessage, "error", "success")
		userNameIsValid = false
	}
})

window.onload = () => {
	userNameInput.value = ""
}

window.addEventListener("keyup", () => {
	statusContainer.classList.add("hidden")
	if (
		userNameInput.value.length 
		&& passwordInput.value.length 
		&& confirmPasswordInput.value.length
	) {
		signupBtn.disabled = false
	} else {
		signupBtn.disabled = true
	}
})

passwordInput.addEventListener("keyup", async () => {
	passwordInput.classList.remove("required")
	if (/[^@&$!#?a-zA-Z0-9]/.test(passwordInput.value) || /[^@&$!#?a-zA-Z0-9]/.test(confirmPasswordInput.value)) {
		updateStatus(passwordMessage, "error", "hidden")
		signupBtn.disabled = false
		return passwordMessage.textContent = "Invalid characters"
	}
	
	const passwordLength = passwordInput.value.length

	if (passwordLength) {
		checkIfPasswordMatch()
		inputIds.forEach(id => {
			const passwordRequirement = document.querySelector(`#${id}`)
			const passwordRequirementFunc = passwordRequirementsObj[id].func
			if (passwordRequirementFunc(passwordInput.value)) {
				updateStatus(passwordRequirement, "success", "error")
				passwordRequirementsObj[id].status = true
			} else {
				updateStatus(passwordRequirement, "error", "success")
				passwordRequirementsObj[id].status = false
			}
		})
	} else {
		passwordMessage.classList.add("hidden")
		allPasswordReqs.forEach(req => {
			req.classList.remove("error")
			req.classList.remove("success")
		})
		signupBtn.disabled = true
	}
})

confirmPasswordInput.addEventListener("keyup", async () => {
	checkIfPasswordMatch()
})

signupBtn.addEventListener("click", async () => {
	const successMsg = "Success. You are now signed up."
	let errMsg
	
	const passwordsMatch = passwordInput.value === confirmPasswordInput.value
	passwordIsValid = checkIfPasswordIsValid()

	if (!userNameIsValid) {
		userNameInput.classList.add("required")
	}

	if (!passwordIsValid) {
		passwordInput.classList.add("required")
	}

	if (!passwordsMatch) {
		confirmPasswordInput.classList.add("required")
	}

	if (!userNameIsValid || !passwordIsValid || !passwordsMatch) {
		signupMessage.textContent = "Please fix all errors."
		return statusContainer.classList.remove("hidden")
	}

	try {
		const response = await fetch("/admin/signup/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				userName: userNameInput.value,
				password: passwordInput.value,
				confirmPassword: confirmPasswordInput.value
			})
		})

		const data = await response.json()
		statusContainer.classList.remove("hidden")

		if (data.ok) {
			document.querySelector("#signup-inputs").classList.add("hidden")
			document.querySelector("#password-requirements").classList.add("hidden")
			document.querySelector("#signup-container").classList.add("hidden")

			updateStatus(signupMessage, "success", "error")
			signupMessage.textContent = "You are now signed up. Please check your email to verify your account."
		} else {
			errMsg = data.error
			throw new Error(errMsg)
		}

	} catch (err) {
		updateStatus(signupMessage, "error", "success")
	}
})
