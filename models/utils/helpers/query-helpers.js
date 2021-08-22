import Tweet from "../../Tweet.js"

const filterTweetsArray = async (tweets) => {
	const filteredTweets = []

	for (let tweet of tweets) {
		const { id, text, created_at: createdAt } = tweet
		const result = await new Tweet().fetchById(id)

		if (result.error && id && text && createdAt) {
			filteredTweets.push(tweet)
		}
	}

	return filteredTweets
}

const insertManyTweetsQB = async (filteredTweets) => {
	const valuesArr = []
	let valuesStr = ""

	filteredTweets.forEach((tweet) => {
		const { id, text, created_at: createdAt } = tweet
		valuesArr.push(`('${id}', '${text.replaceAll("'", "''")}', '${createdAt}')`)
	})

	valuesArr.forEach((value, index) => {
		const comma = index + 1 < valuesArr.length ? "," : ""
		valuesStr = valuesStr + value + comma
	})

	return valuesStr
}

const updateOneUserQB = (updates, updateKeys, id, table) => {
	const fieldsMap = {
		lastPageview: "last_pageview",
		loggedIn: "logged_in",
		password: "password"
	}

	const lastUpdateDate = new Date().toISOString()

	let updateQuery = `UPDATE ${table} SET last_update_date = '${lastUpdateDate}', `

	updateKeys.forEach((update, index) => {
		const column = fieldsMap[update]
		const updateValue = updates[update]
		if (updateKeys.length === index + 1) {
			updateQuery = updateQuery + `${column} = '${updateValue}'`
		} else {
			updateQuery = updateQuery + `${column} = '${updateValue}', `
		}
	})

	updateQuery = updateQuery + ` WHERE id = '${id}'`

	return updateQuery
}

export { filterTweetsArray, insertManyTweetsQB, updateOneUserQB }
