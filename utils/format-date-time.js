const convertDate = (num) => (num < 10 ? "0" + num : num)
const FIVE_HOURS = 18_000_000

const formatTime = (createdAt) => {
	const tweetTime = new Date(createdAt).getTime()
	const tweetDate = new Date(tweetTime - FIVE_HOURS)

	const marker = tweetDate.getHours() >= 12 ? "PM" : "AM"
	let hour = tweetDate.getHours()

	if (hour > 12) {
		hour = hour - 12
	} else if (hour === 0) {
		hour = 12
	} else if (hour < 0) {
		hour = hour + 12
	}

	const minute = convertDate(tweetDate.getMinutes())
	const seconds = convertDate(tweetDate.getSeconds())
	const formattedDate = `${hour}:${minute}:${seconds} ${marker}`

	return formattedDate
}

const formatDateISO = (date) => {
	const tweetDate = new Date(date)
	const tweetYear = tweetDate.getFullYear()
	const tweetMonth = convertDate(tweetDate.getMonth() + 1)
	const tweetDay = convertDate(tweetDate.getDate())

	const tweetDateSubString = `${tweetYear}-${tweetMonth}-${tweetDay}`.substring(0, 10)

	return tweetDateSubString
}

const formatDateStr = (date, makeISO = false) => {
	let tweetDate = date

	if (makeISO) {
		tweetDate = formatDateISO(tweetDate)
	}

	const dateTime = new Date(tweetDate).getTime()
	const formattedDate = new Date(dateTime + FIVE_HOURS).toDateString()

	return formattedDate
}

export { formatDateISO, formatDateStr, formatTime }
