import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`INDPRO backend listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb Connection Error", err);
    process.exit(1);
  });
