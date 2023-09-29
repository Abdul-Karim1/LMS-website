let express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const { PORT } = require("./server/config");

// Create global app object
let app = express();

app.use(express.json());
const allowedOrigins = ["http://localhost:3000"]; // Add your allowed origins here
// Configure CORS middleware for Express app
const corsOptions = {
  origin: (origin, callback) => {
    // console.log("--->aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
      console.log("--->aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    } else {
      callback(new Error("Not allowed by CORS"));
      console.log("--->aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    }
  },
};
app.use(cors(corsOptions));
// finally, let's start our server...
let expressServer = app.listen(process.env.PORT || PORT, function () {
  console.log("Listening on port " + expressServer.address().port);
});

// -------------------------
// Connection URI for MongoDB (replace with your own URI)
const uri = "mongodb://127.0.0.1:27017/aaa";

// Connect to MongoDB
mongoose.connect(uri);

const db = mongoose.connection;

// Event handling for successful connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Event handling for connection errors
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// async function connectToMongoDB() {
//   try {
//     // Connection URI for MongoDB (replace with your own URI)
//     const uri = "mongodb://localhost:27017/aaa";

//     // Connect to MongoDB
//     await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const db = mongoose.connection;

//     // Event handling for successful connection
//     db.once("open", () => {
//       console.log("Connected to MongoDB");
//     });

//     // Event handling for connection errors
//     db.on("error", (error) => {
//       console.error("MongoDB connection error:", error);
//     });
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }

// // Call the async function to connect to MongoDB
// connectToMongoDB();

app.use(require("./server/Routes"));
