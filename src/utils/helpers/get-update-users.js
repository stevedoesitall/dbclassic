import User from "../../../models/User.js"
const user = new User()

const getUser = async (userId) => {
	return await user.fetchOne(userId)
}

const updateUser = async (userId, date) => {
	const updates = {
		lastPageview: date
	}
	
	return await user.updateOne(userId, updates)
}

export { getUser, updateUser }