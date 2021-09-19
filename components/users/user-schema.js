const userSchema = {
	id: {
		type: "string",
		minLength: 5,
		maxLength: 225,
		allowNull: false
	},
	user_name: {
		type: "string",
		minLength: 2,
		maxLength: 225,
		allowNull: false
	},
	user_email: {
		type: "string",
		minLength: 5,
		maxLength: 225,
		allowNull: true
	},
	password: {
		type: "string",
		minLength: 8,
		maxLength: 60,
		allowNull: false
	},
	last_pageview: {
		type: "date",
		minLength: 10,
		maxLength: 10,
		allowNull: true
	},
	create_time: {
		type: "date",
		minLength: 10,
		maxLength: 24,
		allowNull: false
	},
	latest_session_id: {
		type: "string",
		minLength: 36,
		maxLength: 36,
		allowNull: true
	},
	is_admin: {
		type: "boolean",
		minLength: undefined,
		maxLength: undefined,
		allowNull: true
	},
	is_verified: {
		type: "boolean",
		minLength: undefined,
		maxLength: undefined,
		allowNull: true
	},
	verify_time: {
		type: "date",
		minLength: 10,
		maxLength: 24,
		allowNull: true
	},
	token: {
		type: "string",
		minLength: 42,
		maxLength: 42,
		allowNull: true
	},
	token_time: {
		type: "date",
		minLength: 10,
		maxLength: 24,
		allowNull: true
	}
}

export default userSchema