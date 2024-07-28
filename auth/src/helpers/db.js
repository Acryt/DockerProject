const mongoose = require("mongoose");
const { db } = require("../config");

module.exports.connectDB = () => {
	mongoose.connect(db, {});

	return mongoose.connection;
}