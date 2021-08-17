const auth = async (req, res, next) => {
	const errMsg = "You don't have permission to access this page."

	try {
		const authorized = (req.params.id === req.session.loginId) && req.cookies.momus_id

		if (!authorized) {
			throw new Error(errMsg)
		}

		next()

	} catch (err) {
		return res.render("error", {
			errMsg: errMsg
		})
	}
}

export default auth