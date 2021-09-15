const tweetSchema = {
	id: {
		type: "string",
		minLength: 5,
		maxLength: 225,
		allowNull: false
	},
	text: {
		type: "string",
		minLength: 10,
		maxLength: 280,
		allowNull: false
	},
	created_at: {
		type: "date",
		minLength: 10,
		maxLength: 225,
		allowNull: false
	}
}

export default tweetSchema