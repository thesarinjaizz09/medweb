const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGOURI;

const connectToMongoDB = (databaseConnectionURI) => {
    mongoose.connect(mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );

    const db = mongoose.connection
    db.on("error", console.error.bind(console, "X--- Medweb mongo database connection error ---X"));
    db.once("open", function () {
        console.log("X--- Medweb mongo database succesfully connected ---X");
        console.log(`X--- Medweb mongo database connection uri: ${databaseConnectionURI} ---X`);
    });
}

module.exports = connectToMongoDB;