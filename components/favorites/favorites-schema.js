const favoriteSchema = {
	user_id: {
		type: "string",
		minLength: 10,
		maxLength: 225,
		allowNull: false
	},
	tweet_id: {
		type: "string",
		minLength: 5,
		maxLength: 225,
		allowNull: false
	}
}

export default favoriteSchema