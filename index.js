const http = require("http");
const { app, PORT } = require("./src/app");
const Database = require("./src/config/database");

// connect to DB
Database.authenticate()
    .then(() => {
        console.log("Database connection successful...");
    })
    .catch((error) => {
        console.error("Unable to connect to the database: ", error.message);
        process.exit(1);
    });

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log("server listening on port: " + PORT);
});
