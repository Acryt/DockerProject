const express = require("express");
const axios = require("axios");
const { connectDB } = require("./helpers/db");
const { port, host, db, apiUrl } = require("./config");
const app = express();

const startServer = () => {
	app.listen(port, async () => {
		console.log(`Start on ${host}:${port}`);
		console.log(`${db}`);
	});
};

app.get("/", (req, res) => {
	res.send(
		`Start on ${host}:${port}` + '<br>' + `On port ${host}` + '<br>' + `${db}`
	);
});

app.get("/api/testData", (req, res) => {
	axios.get(apiUrl + "/apiData").then((response) => {
		res.json({
			test: true,
			testData: response.data,
		});
	});
});

app.get("/api/currentUser", (req, res) => {
	res.json({
		id: "1",
		email: "Lh5yN@example.com",
	});
});

connectDB()
	.on("error", console.log)
	.on("disconnected", connectDB)
	.once("open", startServer);
