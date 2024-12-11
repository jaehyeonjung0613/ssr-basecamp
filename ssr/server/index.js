import "./config.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import movieRouter from "./routes/index.js";
import movieDetailRouter from "./routes/detail.js";
// import membersRouter from "./routes/members.js"; // 본 미션 참고를 위한 코드이며 사전 미션에서는 사용하지 않습니다.

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/assets", express.static(path.join(__dirname, "../public")));

app.use("/", movieRouter);
app.use("/detail", movieDetailRouter);
// app.use("/members", membersRouter); // 본 미션 참고를 위한 코드이며 사전 미션에서는 사용하지 않습니다.

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
