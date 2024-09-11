const express = require("express");
const mongoose = require("mongoose");
const { connectDB } = require("./helpers/db");
const { port, host, db, authApiUrl } = require("./config");
const app = express();
const multer = require("multer");

const candidateSchema = new mongoose.Schema({
	name: { type: String },
	categoryId: { type: String },
	status: { type: String },
	file: {
		buffer: Buffer,
		fieldname: String,
		originalname: String,
		encoding: String,
		mimetype: String,
		size: Number,
	},
	comment: { type: String },
});
const ticketSchema = new mongoose.Schema({
	ticket: { type: String },
	categoryId: { type: String },
	candidateId: { type: String },
});
const batchSchema = new mongoose.Schema({
	ticket: { type: String },
});
const categoryShchema = new mongoose.Schema({
	title: { type: String },
	status: { type: String },
	comment: { type: String },
});

const Category = mongoose.model("Category", categoryShchema);
const Candidate = mongoose.model("Candidate", candidateSchema);
const Batch = mongoose.model("Batch", batchSchema);
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
app.get("/dropBase", async (req, res) => {
	try {
		await mongoose.connection.dropDatabase();
		res.send("DB dropped");
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
});
app.get("/dropBatch", async (req, res) => {
   try {
      await Batch.deleteMany({});
      res.send("Batch dropped");
   } catch (err) {
      res.status(500).send({ message: err.message });
   }
});
app.get("/getCategory/:id?", async (req, res) => {
	try {
		const id = req.params.id;
		let x = null;
		if (id) {
			x = await Category.findById(id);
		} else {
			x = await Category.find();
		}
		if (!x || (Array.isArray(x) && x.length === 0)) {
			throw new Error("Category not found");
		}
		res.send(x);
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});
app.post("/addCategory", async (req, res) => {
	try {
		const x = new Category(req.body);
		let result = await x.save();
		res.send(result);
	} catch (err) {
		res.status(400).send({
			message: err.message,
		});
	}
});
app.patch("/setCategory", async (req, res) => {});
app.delete("/rmCategory/:id?", async (req, res) => {
	const filter = { _id: req.body.id || req.params.id };
	const result = await Category.findOneAndDelete(filter);
	const delCandidates = await Candidate.deleteMany({
		categoryId: req.body.id,
	});
	const delVotes = await Ticket.deleteMany({
		categoryId: req.body.id,
	});
	res.status(200).json(result);
});

app.get("/getBatch/:id?", async (req, res) => {
	try {
		const id = req.params.id;
		let x;
		if (id) {
			x = await Batch.findById(id);
		} else {
			x = await Batch.find();
		}
		if (!x || (Array.isArray(x) && x.length === 0)) {
			throw new Error("Ticket not found in Batch");
		}
		res.send(x);
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});
app.post("/addBatch", async (req, res) => {
	console.log(req.body);
	if (!req.body.prefix || !req.body.min || !req.body.max) {
		return res.status(400).send({ message: "Missing data" });
	}
	try {
		let prefix = req.body.prefix.toUpperCase();
		let minL = req.body.min.length;
		let min = Number(req.body.min);
		let max = Number(req.body.max);
		let result = [];
		if (min > max) {
			throw new Error("min > max");
		} else {
			for (let i = min; i <= max; i++) {
				iString = i.toString();
				if (iString.length < minL) {
					iString = "0".repeat(minL - iString.length) + iString;
				}
				let x = new Batch({
					ticket: prefix + iString,
					categoryId: req.body.categoryId,
				});
				result.push(...[await x.save()]);
			}
			res.send(result);
		}
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});
app.delete("/rmBatch", async (req, res) => {
	const { id } = req.body;
	const filter = { _id: id };
	const doc = await Pool.findOneAndDelete(filter);
	res.status(200).json(doc);
});

app.get("/getCandidate/:id?", async (req, res) => {
	try {
		const id = req.params.id;
		let x;
		if (id) {
			x = await Candidate.findById(id);
		} else {
			x = await Candidate.find();
		}
		if (!x || (Array.isArray(x) && x.length === 0)) {
			throw new Error("Candidate not found");
		}
		res.send(x);
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});

app.get("/getCandidates/:id?", async (req, res) => {
	try {
		const id = req.params.id;
		let x;
		if (id) {
			x = await Candidate.find({ categoryId: id });
		} else {
			throw new Error("Missing category id");
		}
		if (!x || (Array.isArray(x) && x.length === 0)) {
			throw new Error("Category has no candidates");
		}
		res.send(x);
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});

const upload = multer();

app.post("/addCandidate", upload.single("file"), async (req, res, next) => {
	req.app.disable("json");
	try {
		const name = req.body.name;
		const categoryId = req.body.categoryId;
		const file = req.file;
		const c = new Candidate({
			name,
			categoryId,
			file,
		});
		const result = await c.save();
		res.send(result);
	} catch (err) {
		res.status(500).send({
			message: "Error saving Candidate to DB",
			error: err.message,
		});
	}
});
app.delete("/rmCandidate", async (req, res) => {
	try {
		if (!req.body.id) {
			throw new Error("Missing id");
		}
		const { id } = req.body;
		const filter = { _id: id };
		const result = await Candidate.findOneAndDelete(filter);
		res.send(result);
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});

app.post("/addVote", async (req, res) => {
	try {
		const ticket = (req.body.prefix + req.body.ticket).toUpperCase();
		const categoryId = req.body.categoryId;
		const candidateId = req.body.candidateId;
		if (!req.body.categoryId) {
			throw new Error("Missing categoryId");
		}
		if (!req.body.candidateId) {
			throw new Error("Missing candidateId");
		}
		if (!ticket) {
			throw new Error("Missing ticket number");
		}
		// проверка есть ли такой ticket в Batch
		let b = await Batch.findOne({ ticket: ticket });
		if (!b) {
			throw new Error("Ticket not found in Batch");
		} else {
			// проверка есть ли такой ticket в Ticket
			let t = await Ticket.findOne({ ticket: ticket, categoryId: categoryId });
			if (t) {
				throw new Error("You have already voted in this category");
			} else {
				const t = new Ticket({
					ticket: ticket,
					categoryId: categoryId,
					candidateId: candidateId,
				});
				const result = await t.save();
				res.send(result);
			}
		}
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});
app.get("/getVote/:id?", async (req, res) => {
	try {
		const id = req.params.id;
		console.log("idCy: " + id);
		if (id) {
			let x = await Ticket.find({ categoryId: id });
			if (!x || (Array.isArray(x) && x.length === 0)) {
				throw new Error("Ticket not found");
			}
			res.send(x);
		} else {
			let x = await Ticket.find();
			if (!x || (Array.isArray(x) && x.length === 0)) {
				throw new Error("Ticket not found");
			}
			res.send(x);
		}
	} catch (err) {
		res.status(400).send({ message: err.message });
	}
});
// app.delete("/rmVote", async (req, res) => {
// 	const { categoryId, id } = req.body;
// 	let category = await Category.findById(categoryId);
// 	category.tickets = category.tickets.filter((t) => t._id != id);
// 	const result = await category.save();
// 	console.log(result);
// 	res.status(200).json(result);
// });

connectDB()
	.on("error", console.log)
	.on("disconnected", connectDB)
	.once("open", startServer);
