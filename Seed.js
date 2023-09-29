const mongoose = require("mongoose");
const MONGODB_URI = "mongodb://127.0.0.1:27017/aaa";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    init();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

const defaultUser = require("./server/Seeder/DefaultUsers");

async function init() {
  try {
    console.log("Dropping DB");
    await mongoose.connection.db.dropDatabase();
    await defaultUser();
    exit();
  } catch (error) {
    console.error("Error initializing:", error);
    exit();
  }
}

function exit() {
  console.log("Exiting");
  process.exit(0); // Use 0 to indicate successful exit
}
