const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const uploadRoutes = require("./routes/uploadRoutes");
const askRoutes = require("./routes/askRoutes");

app.use("/upload", uploadRoutes);
app.use("/ask", askRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
