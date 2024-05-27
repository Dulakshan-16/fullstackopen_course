const middlewear = require("../utils/middleware");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

const logger = require("../utils/logger");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

	response.status(200).json(blogs);
});

blogsRouter.post("/", middlewear.userExtractor, async (request, response) => {
	const body = request.body;

	if (!body.title || !body.url) {
		logger.error("missing title or url propery in request");
		return response.status(400).send({ error: "Title or url missing." });
	}

	if (!body.likes) {
		body.likes = 0;
	}

	const user = request.user;

	const blog = new Blog({
		...body,
		user: user._id,
	});

	const savedBlogPost = await blog.save();

	user.blogs = user.blogs.concat(savedBlogPost._id);
	await user.save();

	response.status(201).json(savedBlogPost);
});

blogsRouter.delete(
	"/:id",
	middlewear.userExtractor,
	async (request, response) => {
		const blog = await Blog.findById(request.params.id);

		if (!blog) {
			return response.status(400).json({ error: "invalid id" });
		}

		if (blog.user.toString() !== request.user.id) {
			return response.status(401).json({ error: "unauthorized deletion" });
		}

		await Blog.findByIdAndDelete(request.params.id);

		response.status(204).end();
	}
);

blogsRouter.put("/:id", async (request, response) => {
	const blogs = await Blog.find({});

	const blogIds = blogs.map((blog) => blog.id);

	if (!blogIds.includes(request.params.id)) {
		response.status(400).json({ error: "Invalid id" });
	}

	const body = request.body;

	if (!body.title || !body.url) {
		return response.status(400).json({ error: "Title and url required." });
	}

	if (!body.likes) {
		body.likes = 0;
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
		new: true,
		runValidators: true,
		context: "query",
	});

	response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
