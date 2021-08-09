import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config()

const getUser = async (userId) => {
	const result = await fetch(`${process.env.BASE_URL}/users/${userId}`)
	const data = await result.json()

	return data
}

const postUser = async (userId, date) => {
	const body = {
		date: date
	}

	const update = await fetch(`${process.env.BASE_URL}/users/${userId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	})

	const data = await update.json()
	return data
}

export { getUser, postUser }