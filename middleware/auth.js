const auth = async (req, res, next) => {
	const currentPath = req.route.path.substring(1)
	
	let redirectPage
	let errMsg

	try {
		if (!req.session.loginId && currentPath === "account") {
			redirectPage = "login"
			errMsg = "Unauthenticated user."
			throw new Error(errMsg)
		}

		if (req.session.loginId && currentPath === "login") {
			redirectPage = "account"
			errMsg = "User already logged in."
			throw new Error(errMsg)
		}

		next()
	} catch (err) {
		console.log(errMsg)
		return res.redirect(redirectPage)
	}
}

export default auth