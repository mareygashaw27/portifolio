require("dotenv").config();
const connectDB = require("./config/db");
const Cv = require("./models/Cv");

async function run() {
  await connectDB();
  const cvs = await Cv.find().sort({ uploadedAt: -1 });
  console.log("CVS IN DATABASE:", JSON.stringify(cvs, null, 2));
  process.exit(0);
}

run();
