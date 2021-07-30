import Knex from "knex"
import knexfile from "../config/knexfile.js"
import { Model } from "objection"

const knex = Knex(knexfile.production)

Model.knex(knex)

class Tweet extends Model {
	static get tableName() {
		return "tweets"
	}
}

export default Tweet