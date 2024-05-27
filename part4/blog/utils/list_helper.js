const _ = require("lodash");

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
	const reducer = (sum, blog) => sum + blog.likes;
	return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) return 0;

	let favoriteBlog = blogs[0];

	blogs.forEach((blog) => {
		if (blog.likes > favoriteBlog.likes) {
			favoriteBlog = blog;
		}
	});

	return favoriteBlog;
};

const mostBlogs = (blogs) => {
	if (blogs.length === 0) return 0;

	const countByAuthor = _.countBy(blogs, "author");

	const mappedCountObj = _.map(countByAuthor, (count, authorName) => ({
		author: authorName,
		blogs: count,
	}));

	return _.maxBy(mappedCountObj, (obj) => obj.blogs);
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) return 0;

	const mostLikesBlog = _.maxBy(blogs, (blog) => blog.likes);

	return { author: mostLikesBlog.author, likes: mostLikesBlog.likes };
};
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
