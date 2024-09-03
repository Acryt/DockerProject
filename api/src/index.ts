const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./helpers/db");
const { port, host, db, authApiUrl } = require("./config");
const app = express();

const candidateSchema = new mongoose.Schema({
	name: { type: String },
	categoryId: { type: String },
});
const ticketSchema = new mongoose.Schema({
	ticket: { type: String },
	categoryId: { type: String },
	candidateId: { type: String },
});
const poolSchema = new mongoose.Schema({
	min: { type: String },
	max: { type: String },
});
const categoryShchema = new mongoose.Schema({
	title: { type: String },
	date: { type: Date, default: new Date() },
	status: { type: String },
});

const Category = mongoose.model("Category", categoryShchema);
const Candidate = mongoose.model("Candidate", candidateSchema);
const Pool = mongoose.model("Pool", poolSchema);
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
	let x = await Category.find();
	res.send(x);
});
app.post("/addCategory", async (req, res) => {
	try {
		const x = new Category(req.body);
		console.log(JSON.stringify({ x }));
		let result = await x.save();
		res.send(result);
	} catch (error) {
		res.status(500).send({
			message: "Error saving Category to DB",
			error: error,
		});
	}
});
app.delete("/deleteCategory", async (req, res) => {
	const { id } = req.body;
	const filter = { _id: id };
	const doc = await Category.findOneAndDelete(filter);
	res.status(200).json(doc);
});
app.get("/getPool", async (req, res) => {
	let x = await Pool.find();
	res.send(x);
})
app.post("/addPool", async (req, res) => {
	let min = toNumber(req.body.min);
	let max = toNumber(req.body.max);
	try {
		if (req.body.min > req.body.max) {
			return res.status(400).send({
				category: category,
				message: "Min > Max",
			});
		}
		const x = new Pool(req.body);
		console.log(JSON.stringify({ x }));
		let result = await x.save();
		res.send(result);
	} catch (error) {
		res.status(500).send({
			message: "Error saving Pool to DB",
			error: error,
		});
	}
});
app.delete("/deletePool", async (req, res) => {
	const { id } = req.body;
	const filter = { _id: id };
	const doc = await Pool.findOneAndDelete(filter);
	res.status(200).json(doc);
});

app.post("/addCandidate", async (req, res) => {
	try {
		const c = new Candidate({ name: req.body.name });
		const category = await Category.findById(req.body.categoryId);
		category.candidates.push(c);
		const result = await category.save();
		res.send(result);
	} catch (error) {
		res.status(500).send({
			message: "Error saving Candidate to DB",
			error: error,
		});
	}
});
app.delete("/deleteCandidate", async (req, res) => {
	const { categoryId, id } = req.body;
	let category = await Category.findById(categoryId);
	category.candidates = category.candidates.filter((c) => c._id != id);
	const result = await category.save();
	console.log(result);
	res.status(200).json(result);
});

app.post("/addTicket", async (req, res) => {
	try {
		const category = await Category.findById(req.body.categoryId);
		if (category.tickets.find((t) => t.ticket === req.body.ticket)) {
			return res.status(400).send({
				category: category,
				message: "Ticket already exists",
			});
		} else {
			const t = new Ticket({
				ticket: req.body.ticket,
				candidateId: req.body.candidateId,
			});
			category.tickets.push(t);
			const result = await category.save();
			res.send(category);
		}
	} catch (error) {
		res.status(500).send({
			message: "Error saving Ticket to DB",
			error: error,
		});
	}
});
app.delete("/deleteTicket", async (req, res) => {
	const { categoryId, id } = req.body;
	let category = await Category.findById(categoryId);
	category.tickets = category.tickets.filter((t) => t._id != id);
	const result = await category.save();
	console.log(result);
	res.status(200).json(result);
});

connectDB()
	.on("error", console.log)
	.on("disconnected", connectDB)
	.once("open", startServer);
