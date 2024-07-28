const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const { connectDB } = require("./helpers/db");
const { port, host, db, authApiUrl } = require("./config");
const app = express();
const postSchema = new mongoose.Schema({
	name: String,
});
const Post = mongoose.model("Post", postSchema);

const startServer = () => {
	app.listen(port, async () => {
		console.log(`Start on ${host}:${port}`);
		console.log(`${db}`);

		const silence = new Post({ name: "Silence" });
		await silence.save();
		const kittens = await Post.find();
		console.log(kittens);
		Post.deleteMany({ name: "Silence" })
			.then(function () {
				console.clear();
				console.log("Silence deleted");
			})
			.catch(function (error) {
				console.log(error);
			});
	});
};

app.get("/", (req, res) => {
	res.send(
		`Start on ${host}:${port}` + "<br>" + `On port ${host}` + "<br>" + `${db}`
	);
});

app.get("/api/apiData", (req, res) => {
	res.send({
		testData: true,
		asd: "asd",
	})
});

app.get("/testCurrentUser", (req, res) => {
	axios.get(authApiUrl + "/currentUser").then((response) => {
		res.json({
			testCurrentUser: true,
			user: response.data,
		});
	});
});

connectDB()
	.on("error", console.log)
	.on("disconnected", connectDB)
	.once("open", startServer);
