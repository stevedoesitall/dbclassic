import Tweet from "../../Tweet.js"

const filterTweetsArray = async (tweets) => {
	const filteredTweets = []

	for (let tweet of tweets) {
		const { id, text, created_at: createdAt } = tweet
		const result = await new Tweet().fetchById(id, true)

		if (result.error && id && text && createdAt) {
			filteredTweets.push(tweet)
		}
	}

	return filteredTweets
}

const updateOneUserQB = (updates, updateKeys, id) => {
	const fieldsMap = {
		lastPageview: "last_pageview",
		loggedIn: "logged_in",
		password: "password",
		userName: "user_name"
	}

	const lastUpdateDate = new Date().toISOString()
	const values = [ lastUpdateDate ]
	const start = 2
	const idPos = updateKeys.length + 2

	let text = "UPDATE users SET last_update_date = $1,"
	let valuesText = ""

	updateKeys.forEach((update, index) => {
		const column = fieldsMap[update]
		valuesText = valuesText + `${column} = $${index + start},`
		values.push(updates[update])
	})

	values.push(id)

	text = `${text}${valuesText.slice(0, -1)} WHERE id = $${idPos}`

	return {
		text,
		values
	}
}

export { filterTweetsArray, updateOneUserQB }
