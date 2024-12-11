import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPopular } from "../services/movie.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const renderMovieItems = (movieItems = []) => {
  return movieItems.map(
    ({ id, title, thumbnail, rate }) => /*html*/ `
      <li>
      <a href="/detail/${id}">
        <div class="item">
          <img
            class="thumbnail"
            src="https://media.themoviedb.org/t/p/w440_and_h660_face/${thumbnail}"
            alt="${title}"
          />
          <div class="item-desc">
            <p class="rate"><img src="../assets/images/star_empty.png" class="star" /><span>${rate}</span></p>
            <strong>${title}</strong>
          </div>
        </div>
      </a>
    </li>
    `
  );
};

router.get("/", async (_, res) => {
  const templatePath = path.join(__dirname, "../../views", "index.html");
  const movieItems = await getPopular();
  const moviesHTML = renderMovieItems(movieItems).join("");

  const template = fs.readFileSync(templatePath, "utf-8");
  const renderedHTML = template.replace(
    "<!--${MOVIE_ITEMS_PLACEHOLDER}-->",
    moviesHTML
  );

  res.send(renderedHTML);
});

export default router;
