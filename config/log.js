import fs from "fs"
import path from "path"

const today = new Date().toDateString()
const logFile = `./logs/${today.replaceAll(" ", "_")}.txt`
const logFilePath = path.resolve(logFile)
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" })

export default accessLogStream