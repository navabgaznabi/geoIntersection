This is a Node.js web application that finds intersections between a linestring and an array of lines using the Turf.js library. It uses the Express.js framework for handling HTTP requests and Winston for logging.

<h1> Getting started </h1>
To get started with this application, clone the repository and install the dependencies:

Then start the server:

This will start the server listening on port 3000.

<h2> API <br><br>
POST /api/intersection</h2>


Post Request Body:
<code>
{
  "linestring": {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-77.04341, 38.89978],
        [-77.04313, 38.89978],
        [-77.04281, 38.89978],
        [-77.04249, 38.89978],
        [-77.04222, 38.89978]
      ]
    }
  },
  "lines": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-77.0428, 38.897],
          [-77.0428, 38.901]
        ]
      },
      "properties": {
        "id": "L01"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-77.0443, 38.897],
          [-77.0443, 38.901]
        ]
      },
      "properties": {
        "id": "L02"
      }
    },
    // Add more lines as required
  ]
}
</code>

<h6>
1 . If the request is successful and there are intersections, the response will be an array of objects with an id property and a point property, where id is the id of the line and point is the coordinates of the intersection point.
<h6>

<h6>
2. If the request is successful but there are no intersections, the response will be an object with a message property set to "No intersection".
</h6>

<h6>3. If there is an error, the response will be an object with a message property set to "Internal server error" and a status code of 500. </h6>

<h2>Error handling</h2>
##### If an error occurs, the server will log the error and return a response with a status code of 500 and a JSON body with a message property set to "Internal server error".

<h2>Logging</h2>
#### This application uses Winston to log incoming requests and errors. Request logs include the HTTP method, URL, query parameters, and request body. Error logs include the error message and stack trace. Logs are written to a file named error.log for errors and combined.log for all other logs. Logs are also printed to
