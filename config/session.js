import dotenv from "dotenv"
import { v4 as uuidv4 } from "uuid"

dotenv.config()

const sessionObj = {
	name: "momus_session",
	genid: () => {
		return uuidv4()
	},
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		sameSite: true,
		maxAge: 30 * 24 * 60 * 60 * 1000
	}
}
  
export default sessionObj