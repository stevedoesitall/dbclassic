//Clean up let/const, naming conventions

const formatTime = (tweet) => {
	const formattedTweet = tweet
	const FIVE_HOURS = 18_000_000
	const tweetTime = new Date(formattedTweet.created_at).getTime()
	const tweetDate = new Date(tweetTime - FIVE_HOURS)

	formattedTweet.marker = tweetDate.getHours() >= 12 ? "PM" : "AM"
	formattedTweet.hour = tweetDate.getHours()

	if (formattedTweet.hour > 12) {
		formattedTweet.hour = tweet.hour - 12
	} else if (formattedTweet.hour === 0) {
		formattedTweet.hour = 12
	} else if (formattedTweet.hour < 0) {
		formattedTweet.hour = tweet.hour + 12
	}

	formattedTweet.minute = tweetDate.getMinutes() < 10 ? "0" + tweetDate.getMinutes() : tweetDate.getMinutes(),
	formattedTweet.seconds = tweetDate.getSeconds() < 10 ? "0" + tweetDate.getSeconds() : tweetDate.getSeconds(),
	formattedTweet.formattedTime = `${formattedTweet.hour}:${formattedTweet.minute}:${formattedTweet.seconds} ${formattedTweet.marker}`
    
	return formattedTweet.formattedTime
}

const formatDateISO = (date) => {
	const convertDate = (num) => num < 10 ? "0" + num : num
	let tweetDate = new Date(date)

	const tweetYear = tweetDate.getFullYear()
	const tweetMonth = convertDate(tweetDate.getMonth() + 1)
	const tweetDay = convertDate(tweetDate.getDate())

	tweetDate = `${tweetYear}-${tweetMonth}-${tweetDay}`
	tweetDate = tweetDate.substring(0, 10)

	return tweetDate
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