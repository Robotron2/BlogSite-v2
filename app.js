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
// mongoose.connect("mongodb://localhost:27017/BlogsDB")
// mongoose.connect("mongodb+srv://admin-theo:Test123@cluster0.wz55twn.mongodb.net/BlogDB")
mongoose.connect("mongodb+srv://admin-theo:Test123@cluster1.6iktobd.mongodb.net/BlogDB")
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

const defaultBlog = `Honorificabilitudinitatibus is the longest English word that consists strictly of alternating consonants and vowels`

//In the next version, I'll make the default blog a random fact from an API.

const Blog = mongoose.model("Blog", blogSchema)

app.get("/", async function (req, res) {
	await Blog.find({}).then((blogs) => {
		res.render("home", { fact: defaultBlog, allBlogs: blogs })
	})
})

app.get("/about", function (req, res) {
	res.render("about")
})

app.get("/contact", function (req, res) {
	res.render("contact")
})

app.get("/compose", function (req, res) {
	res.render("compose")
})

app.get("/blogs/:blogId", async function (req, res) {
	const requestedBlogId = req.params.blogId

	await Blog.findOne({ _id: requestedBlogId }).then((blog) => {
		res.render("blog", { blogTitle: blog.title, blogContent: blog.content, blogAuthor: blog.author })
	})
})

app.post("/compose", async function (req, res) {
	let postTitle = _.upperFirst(req.body.postTitle)
	let postBody = _.upperFirst(req.body.postBody)
	let postAuthor = _.upperFirst(req.body.postAuthor)

	const newBlog = new Blog({
		title: postTitle,
		author: postAuthor,
		content: postBody
	})

	await newBlog.save()
	res.redirect("/")
})

//Spin up the server
app.listen(4000, () => {
	console.log("App is running on port 4000")
})
