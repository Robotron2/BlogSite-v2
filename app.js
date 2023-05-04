//Require the important packages
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static("public"))

//Connect to DB
mongoose.connect("mongodb://localhost:27017/BlogsDB")

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
})

const defaultBlog = `
Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima iste quam fuga tempora voluptate cupiditate veniam est, similique nisi, quo blanditiis? Dignissimos magni esse ab et possimus fuga recusandae praesentium?
Enim distinctio officia quas, tenetur porro exercitationem, qui quibusdam ad accusamus nemo provident repudiandae dolorum id vero veritatis odit quis voluptates error sequi. Ad veritatis eligendi maxime eos officia aut?
Numquam soluta laborum odio inventore natus, voluptates, distinctio aliquid veniam voluptatum animi laudantium commodi ex minus exercitationem ipsum dignissimos unde id aperiam, quos rerum quae tempora cum. Eius, excepturi aliquid?
`

const Blog = mongoose.model("Blog", blogSchema)

app.get("/", function (req, res) {
	res.render("home", { fact: defaultBlog })
})

app.get("/compose", function (req, res) {
	res.render("compose")
})

app.post("/compose", function (req, res) {
	let postTitle = req.body.postTitle
	let postBody = req.body.postBody
	let postAuthor = req.body.postAuthor

	const newBlog = new Blog({
		title: postTitle,
		author: postAuthor,
		content: postBody
	})

	newBlog.save()
	res.redirect("/")
})

//Spin up the server
app.listen(4000, () => {
	console.log("App is running on port 4000")
})
