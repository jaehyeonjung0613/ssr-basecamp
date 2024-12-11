import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchMovies } from "../apis/movie.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get("/", async (_, res) => {
  const templatePath = path.join(__dirname, "../../views", "index.html");
  const moviesData = await fetchMovies();
  const moviesHTML = `
    <div>
      ${JSON.stringify(moviesData)}
    </div>
  `;

  const template = fs.readFileSync(templatePath, "utf-8");
  const renderedHTML = template.replace(
    "<!--${MOVIE_ITEMS_PLACEHOLDER}-->",
    moviesHTML
  );

  res.send(renderedHTML);
});

export default router;
