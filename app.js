//Require the important packages
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const _ = require("lodash")

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static("public"))

//Spin up the server
app.listen(4000, () => {
	console.log("App is running on port 4000")
})
