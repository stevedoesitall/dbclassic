import User from "../components/users/users-model.js"

const redirect = async (req, res, next) => {
	const user = new User()

	if (req.session.loginId) {
		const userId = req.session.loginId
		const data = await user.fetchById(userId)

		if (!data.ok) {
			req.session.destroy((err) => {
				if (err) {
					console.log(err)
				}
			})	
		}
	}

	const currentPath = req.route.path.substring(1)
	const accountRedirectPages = [ "account" ]
	const loginRedirectPages = [ "login", "signup" ]

	let redirectPage
	let errMsg

	try {
		if (!req.session.loginId && accountRedirectPages.includes(currentPath)) {
			redirectPage = "/login"
			errMsg = "Unauthenticated user."
			throw new Error(errMsg)
		}

		if (req.session.loginId && loginRedirectPages.includes(currentPath)) {
			redirectPage = "/account"
			errMsg = "User already logged in."
			throw new Error(errMsg)
		}

		next()
	} catch (err) {
		console.log(errMsg)
		return res.redirect(redirectPage)
	}
}

export default redirect