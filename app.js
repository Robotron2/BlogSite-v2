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
	Blog.find({}).then((blogs) => {
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

	//   Post.findOne({_id: requestedPostId}, function(err, post){
	//     res.render("post", {
	//       title: post.title,
	//       content: post.content
	//     });

	Blog.findOne({ _id: requestedBlogId }).then((blog) => {
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
