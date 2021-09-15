const userSchema = {
	id: {
		type: "string",
		minLength: 10,
		maxLength: 225,
		allowNull: false
	},
	user_name: {
		type: "string",
		minLength: 5,
		maxLength: 225,
		allowNull: false
	},
	password: {
		type: "string",
		minLength: 8,
		maxLength: 225,
		allowNull: false
	},
	last_pageview: {
		type: "date",
		minLength: 10,
		maxLength: 10,
		allowNull: true
	},
	created_at: {
		type: "date",
		minLength: 10,
		maxLength: 225,
		allowNull: false
	},
	latest_session_id: {
		type: "string",
		minLength: 36,
		maxLength: 36,
		allowNull: true
	}
}

export default userSchema