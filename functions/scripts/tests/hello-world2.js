const logger = require("firebase-functions/logger");

async function helloWorld2Handler(request, response) {
	logger.info("Hello logs message!", { structuredData: true });
	// response.send("Hello from Firebase! lala");
	response.json({ data: { message: "Hello from Firebase!" } });
}

module.exports = helloWorld2Handler;