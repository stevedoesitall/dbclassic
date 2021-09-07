import Tweet from "../components/tweets/tweets-model.js"

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

export { filterTweetsArray }