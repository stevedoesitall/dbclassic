import User from "../components/users/users-model.js"

const verifySignup = async (req, res, next) => {
	const user = new User()
	const data = await user.fetchByToken(req.params.id)

	if (!data.ok) {
		return res.render("error", {
			errMsg: "Invalid token."
		})
	}

	if (data.result.is_verified) {
		return res.render("error", {
			errMsg: "Account already verified."
		})
	}

	const values = {
		is_verified: true
	}

	await user.updateOne(data.result.id, values)

	next()
}

export default verifySignup