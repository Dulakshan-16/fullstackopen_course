const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");

const User = require("../models/user");

describe("when there is initially one user in db", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash("test", 10);
		const user = new User({ username: "root", passwordHash });

		await user.save();
	});

	test("creation suceeds with a fresh username", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "dulakshan",
			name: "Dulakshan Swarna",
			password: "test",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

		const usernames = usersAtEnd.map((user) => user.username);
		assert(usernames.includes(newUser.username));
	});

	describe("creation fails with proper status code and message for invalid users", () => {
		test("fails for missing password", async () => {
			const invalidUser = {
				username: "user1",
			};

			await api
				.post("/api/users")
				.send(invalidUser)
				.expect(400)
				.expect("Content-Type", /application\/json/);
		});

		test("fails for invalid password length", async () => {
			const invalidUser = {
				username: "user1",
				password: "ab",
			};

			await api
				.post("/api/users")
				.send(invalidUser)
				.expect(400)
				.expect("Content-Type", /application\/json/);
		});

		test("fails for missing username", async () => {
			const invalidUser = {
				name: "user1",
				password: "test",
			};

			await api
				.post("/api/users")
				.send(invalidUser)
				.expect(400)
				.expect("Content-Type", /application\/json/);
		});

		test("fails for invalid username length", async () => {
			const invalidUser = {
				name: "ab",
				password: "test",
			};

			await api
				.post("/api/users")
				.send(invalidUser)
				.expect(400)
				.expect("Content-Type", /application\/json/);
		});

		test("fails for duplicate username", async () => {
			const invalidUser = {
				username: "root",
				password: "test",
			};

			await api
				.post("/api/users")
				.send(invalidUser)
				.expect(400)
				.expect("Content-Type", /application\/json/);
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
