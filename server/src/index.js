import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 8080;
connectDB(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`✓ API on :${port}`)))
  .catch((err) => {
    console.error("DB error", err);
    process.exit(1);
  });
