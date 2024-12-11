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

export const renderMovieItemPage = (movieItems) => {
  const bestMovieItem = movieItems[0];
  const moviesHTML = renderMovieItems(movieItems).join("");

  const templatePath = path.join(__dirname, "../../views", "index.html");
  let template = fs.readFileSync(templatePath, "utf-8");

  template = template.replace("<!--${MOVIE_ITEMS_PLACEHOLDER}-->", moviesHTML);
  template = template.replace(
    "${background-container}",
    "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/" +
      bestMovieItem.thumbnail
  );
  template = template.replace("${bestMovie.rate}", bestMovieItem.rate);
  template = template.replace("${bestMovie.title}", bestMovieItem.title);

  return template;
};

router.get("/", async (_, res) => {
  const movieItems = await getPopular();
  const renderedHTML = renderMovieItemPage(movieItems);

  res.send(renderedHTML);
});

export default router;
