const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");

const Blog = require("../models/blog");
const User = require("../models/user");

describe("when there is initially some blog posts saved", () => {
	beforeEach(async () => {
		await Blog.deleteMany({});
		await User.deleteMany({});

		await Blog.insertMany(helper.initialBlogs);

		await api.post("/api/users").send(helper.rootUser);
	});

	describe("validate blog post structure", () => {
		test("blog posts returned as json ", async () => {
			const response = await api
				.get("/api/blogs")
				.expect(200)
				.expect("Content-Type", /application\/json/);

			assert.strictEqual(response.body.length, 6);
		});

		test("unique identifier property is named 'id'", async () => {
			const response = await api.get("/api/blogs");

			const keys = Object.keys(response.body[0]);

			assert(keys.includes("id") && !keys.includes("_id"));
		});
	});

	describe("addition of a new blog post", () => {
		test("a blog post can be added", async () => {
			const loginResponse = await api.post("/api/login").send(helper.rootUser);

			const token = loginResponse.body.token;
			const newBlog = {
				title: "Bruhhh",
				author: "Dulaksan Swarna",
				url: "google.com",
				likes: 2,
			};

			await api
				.post("/api/blogs")
				.set("Authorization", "Bearer " + token)
				.send(newBlog)
				.expect(201)
				.expect("Content-Type", /application\/json/);

			const blogPostsAtEnd = await helper.blogsInDb();
			assert.strictEqual(blogPostsAtEnd.length, helper.initialBlogs.length + 1);

			const blogUrls = blogPostsAtEnd.map((blog) => blog.url);
			assert(blogUrls.includes("google.com"));
		});

		test("default likes is 0 if likes property is missing", async () => {
			const loginResponse = await api.post("/api/login").send(helper.rootUser);

			const token = loginResponse.body.token;

			const newBlog = {
				title: "Test",
				author: "Dulaksan Swarna",
				url: "test.com",
			};

			await api
				.post("/api/blogs")
				.set("Authorization", "Bearer " + token)
				.send(newBlog)
				.expect(201)
				.expect("Content-Type", /application\/json/);

			const blogs = await helper.blogsInDb();

			const addedBlog = blogs.find((blog) => blog.url == newBlog.url);

			assert.strictEqual(addedBlog.likes, 0);
		});

		test("missing title or url property gives status code 400", async () => {
			const loginResponse = await api.post("/api/login").send(helper.rootUser);

			const token = loginResponse.body.token;

			const newBlog = {
				author: "Dulaksan Swarna",
				likes: 1,
			};

			await api
				.post("/api/blogs")
				.set("Authorization", "Bearer " + token)
				.send(newBlog)
				.expect(400)
				.expect("Content-Type", /application\/json/);
		});

		test("invalid token gives status code 401", async () => {
			const token = "invalid";

			const newBlog = {
				title: "Bruhhh",
				author: "Dulaksan Swarna",
				url: "google.com",
				likes: 2,
			};

			await api.post("/api/blogs").set("Authorization", "Bearer " + token)
				.send(newBlog)
				.expect(401);
		});
	});

	describe("deletion of blog post", () => {
		test("suceeds with status 204 if id is valid", async () => {
			const id = helper.initialBlogs[0]._id;
			await api.delete(`/api/blogs/${id}`).expect(204);
		});

		test("fails with status code 400 if id is invalid", async () => {
			const invalidId = "123";

			await api
				.delete(`/api/blogs/${invalidId}`)
				.expect(400)
				.expect("Content-Type", /application\/json/);
		});
	});

	describe("updation of blog post", () => {
		test("succeeds with status 200 if id and blog post is valid", async () => {
			const id = helper.initialBlogs[0]._id;

			const updatedBlog = {
				title: "React patterns",
				author: "Michael Chan",
				url: "https://reactpatterns.com/",
				likes: 0,
			};

			await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(200);
		});

		describe("invalid requests", () => {
			test("fails with status code 400 if id is invalid", async () => {
				const invalidId = "123";

				await api.put(`/api/blogs/${invalidId}`).expect(400);
			});

			test("fails with status code 400 if request is missing title or url", async () => {
				const id = helper.initialBlogs[0].__id;

				const updatedBlog = {
					url: "https://reactpatterns.com/",
					likes: 0,
				};

				await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(400);
			});
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
