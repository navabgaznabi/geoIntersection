const express = require("express");
const winston = require("winston");
const turf = require("@turf/turf");

const bodyParser = require('body-parser');
const app = express();

// Parse JSON request bodys
app.use(bodyParser.json({ limit: '10mb' }));

// Middleware function to check authentication
const authCheck = (req, res, next) => {
    const authToken = req.headers.authorization;

    // Check if authToken is present
    if (!authToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if authToken is valid
    if (authToken !== "navabisgoodboy") {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // If authToken is present and valid, continue to next middleware
    next();
};

// Define the route handler function for the POST request
app.post("/api/intersection", authCheck, (req, res) => {
        // Parse the 'linestring' and 'lines' from the request body
        const { linestring, lines } = req.body;

        // Validate request body
        if (
            !linestring ||
            linestring.type !== "Feature" ||
            linestring.geometry.type !== "LineString"
        ) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        // Convert the input to turf.js features
        const linestringFeature = turf.lineString(
            linestring.geometry.coordinates
        );
        const linesFeatures = lines.map((line) => {
            // Create a turf.js feature for each line with its ID
            return turf.lineString(line.geometry.coordinates, {
                id: line.properties.id,
            });
        });

        // Find intersections using turf.js
        const intersections = linesFeatures
            .map((line) => {
                // Calculate the intersection between the linestring and each line
                const intersection = turf.lineIntersect(
                    linestringFeature,
                    line
                );

                // If there is no intersection, return null
                if (intersection.features.length === 0) {
                    return null;
                }

                // If there is an intersection, return an object with the line ID and the intersection point
                return {
                    id: line.properties.id,
                    point: intersection.features[0].geometry.coordinates,
                };
            })
            .filter((intersection) => intersection !== null);

        // If there are no intersections, return a message saying so
        if (intersections.length === 0) {
            return res.json({ message: "No intersection" });
        }

        // Return the intersections as a JSON response
        res.json(intersections);

});

// Set up logging
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

// Log incoming requests
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.body,
    });
    next();
});

// Log errors
app.use((err, req, res, next) => {
    logger.error(
        `Error at line ${err.stack.split("\n")[1].trim()}: ${err.message}`
    );
    res.status(500).json({ message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});