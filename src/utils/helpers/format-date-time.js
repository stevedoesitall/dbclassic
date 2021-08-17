const convertDate = (num) => (num < 10 ? "0" + num : num)

const formatTime = (tweet) => {
	const FIVE_HOURS = 18_000_000
	const formattedTweet = tweet
	const tweetTime = new Date(formattedTweet.created_at).getTime()
	const tweetDate = new Date(tweetTime - FIVE_HOURS)

	formattedTweet.marker = tweetDate.getHours() >= 12 ? "PM" : "AM"
	formattedTweet.hour = tweetDate.getHours()

	if (formattedTweet.hour > 12) {
		formattedTweet.hour = formattedTweet.hour - 12
	} else if (formattedTweet.hour === 0) {
		formattedTweet.hour = 12
	} else if (formattedTweet.hour < 0) {
		formattedTweet.hour = formattedTweet.hour + 12
	}

	formattedTweet.minute = convertDate(tweetDate.getMinutes())
	formattedTweet.seconds = convertDate(tweetDate.getSeconds())
	formattedTweet.formattedTime = `${formattedTweet.hour}:${formattedTweet.minute}:${formattedTweet.seconds} ${formattedTweet.marker}`

	return formattedTweet.formattedTime
}

const formatDateISO = (date) => {
	const tweetDate = new Date(date)
	const tweetYear = tweetDate.getFullYear()
	const tweetMonth = convertDate(tweetDate.getMonth() + 1)
	const tweetDay = convertDate(tweetDate.getDate())

	const tweetDateSubString = `${tweetYear}-${tweetMonth}-${tweetDay}`.substring(
		0,
		10
	)

	return tweetDateSubString
}

const formatDateStr = (date, makeISO = false) => {
	let tweetDate = date

	if (makeISO) {
		tweetDate = formatDateISO(tweetDate)
	}

	const dateTime = new Date(tweetDate).getTime()
	const formattedDate = new Date(dateTime).toDateString()

	return formattedDate
}

export { formatDateISO, formatDateStr, formatTime }
