import Tweet from "../Tweet.js"

const filterArray = async (tweets) => {
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

const buildQuery = async (filteredTweets) => {
    const valuesArr = []
    let valuesStr = ""

    filteredTweets.forEach(tweet => {
        const { id, text, created_at: createdAt } = tweet
        valuesArr.push(`('${id}', '${text.replaceAll("'", "''")}', '${createdAt}')`)
    })

    valuesArr.forEach((value, index) => {
        const comma = index + 1 < valuesArr.length ? "," : ""
        valuesStr = valuesStr + value + comma
    })

    return valuesStr
}

export { filterArray, buildQuery }