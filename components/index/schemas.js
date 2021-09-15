import userSchema from "../users/user-schema.js"
import favoriteSchema from "../favorites/favorites-schema.js"
import tweetSchema from "../tweets/tweets-schema.js"

const validator = (key, value, tableName) => {
	const schemas = {
		users: userSchema,
		favorites: favoriteSchema,
		tweets: tweetSchema
	}

	const table = schemas[tableName]

	if (table[key] !== undefined) {
		if (
			(!value && table[key].allowNull) || 
			(
				(
					(typeof value === table[key].type && table[key].type !== "date") || 
					(table[key].type == "date" && new Date(value).getTime() > 0)
				)
				&& value.length >= table[key].minLength
				&& value.length <= table[key].maxLength
			)
		) {
			return true
		}
	} 

	return false
}

export default validator