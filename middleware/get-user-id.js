const getUserId = (req, res, next) => {
	const userId = req.session.loginId

	if (!userId) {
		const errJson = {
			error: "Unauthorized user.",
			ok: false
		}

		return res.status(401).json(errJson)
	}

	next()
}

export default getUserId