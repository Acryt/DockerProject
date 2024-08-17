const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./helpers/db");
const { port, host, db, authApiUrl } = require("./config");
const app = express();

const candidateSchema = new mongoose.Schema({
	candidateName: { type: String },
});
const ticketSchema = new mongoose.Schema({
	ticket: { type: String },
	vote: { type: String },
});
const votesShchema = new mongoose.Schema({
	title: { type: String },
	date: { type: Date, default: new Date() },
	status: { type: String },
	candidates: [[candidateSchema]],
	tickets: [[ticketSchema]],
});

const Vote = mongoose.model("Vote", votesShchema);
const Candidate = mongoose.model("Candidate", candidateSchema);
const Ticket = mongoose.model("Ticket", ticketSchema);

app.use(express.json());

const startServer = () => {
	app.listen(port, async () => {
		console.log(`---START---`);
	});
};

app.get("/", (req, res) => {
	res.send(
		`Start on ${host}:${port}` + "<br>" + `On port ${host}` + "<br>" + `${db}`
	);
});

app.get("/getData", async (req, res) => {
	let x = await Vote.find();
	res.send(x);
});

app.get("/getCandidates/:voteId", async (req, res) => {
	let x = await Vote.find({ _id: req.query.voteId });
	res.send(x);
});

app.post("/postVote", async (req, res) => {
	try {
		const x = new Vote(req.body);
		console.log(JSON.stringify({ x }));
		let result = await x.save();
		res.send(result);
	} catch (error) {
		res.status(500).send({
			message: "Error saving vote to database",
			error: error,
		});
	}
});
app.post("/postCandidate", async (req, res) => {
	try {
		const c = new Candidate({ candidateName: req.body.candidateName });
		const vote = await Vote.findById(req.body.voteId);
		vote.candidates.push(c);
		const result = await vote.save();
		res.send(result);
	} catch (error) {
		res.status(500).send({
			message: "Error saving vote to database",
			error: error,
		});
	}
});

// // The result of `findOneAndUpdate()` is the document _before_ `update` was applied

app.delete("/deleteVote", async (req, res) => {
	const { id } = req.body;
	const filter = { _id: id };
	const del = { age: 59 };
	const doc = await Vote.findOneAndDelete(filter, del);
	res.status(200).json(doc);
});

app.put("/putVote", async (req, res) => {
	try {
		const x = new Vote(req.body);
		console.log(JSON.stringify({ x }));
		await x.save();
		res.send({ message: "ok" });
	} catch (error) {
		res.status(500).send({
			message: "Error saving vote to database",
			error: error,
		});
	}
});
// app.get("/testCurrentUser", (req, res) => {
// 	axios.get(authApiUrl + "/currentUser").then((response) => {
// 		res.json({
// 			testCurrentUser: true,
// 			user: response.data,
// 		});
// 	});
// });

connectDB()
	.on("error", console.log)
	.on("disconnected", connectDB)
	.once("open", startServer);
