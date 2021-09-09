import dotenv from "dotenv"
import app from "../src/app.js"

dotenv.config({
	path: "../.env"
})

const port = process.env.PORT

app.listen(port, (err) => {
	if (err) {
		console.log("Error starting server")
	} else {
		console.log(`Server running on port ${port}`)
	}
})