const setCookie = (req, res, next) => {
	const isLoggedIn = req.body.updates.loggedIn

	if (isLoggedIn) {
		res.cookie("momus_id", req.body.id, {
			sameSite: "strict",
			httpOnly: true
		})
	} else {
		res.clearCookie("momus_id")
	}

	next()
}

export default setCookie