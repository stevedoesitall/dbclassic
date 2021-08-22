const setCookie = (req, res, next) => {
	const loginAction = Object.keys(req.body.updates).includes("loggedIn")
	const cookieObj = {
		sameSite: "strict",
		httpOnly: true
	}

	if (loginAction) {
		const isLoggedIn = req.body.updates.loggedIn
		if (isLoggedIn) {
			res.cookie("momus_id", req.body.id, cookieObj)
		} else {
			res.clearCookie("momus_id")
		}
	}
	
	next()
}

export default setCookie