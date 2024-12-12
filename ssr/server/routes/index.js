import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  getNowPlaying,
  getPopular,
  getTopRated,
  getUpcoming,
} from "../services/movie.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const categories = {
  nowPlaying: "상영 중",
  popular: "인기순",
  topRated: "평점순",
  upcoming: "상영 예정",
};

const TAB_ROUTES = ["/now-playing", "/popular", "/top-rated", "/upcoming"];

export const MOVIE_LIST_CALLBACKS = [
  getNowPlaying,
  getPopular,
  getTopRated,
  getUpcoming,
];

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

const renderTabItems = (selectedIndex) => {
  return Object.values(categories).map(
    (category, index) => /*html*/ `
  <li>
    <a href="${TAB_ROUTES[index]}">
      <div class="tab-item${selectedIndex === index ? " selected" : ""}">
        <h3>${category}</h3>
      </div></a
    >
  </li>
`
  );
};

export const renderMovieItemPage = (movieItems, selectedIndex) => {
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

  const tabsHTML = renderTabItems(selectedIndex).join("");
  template = template.replace("<!--${TAB_PLACEHOLDER}-->", tabsHTML);

  return template;
};

router.get("/", async (_, res) => {
  const tabIndex = 1;
  const movieItems = await MOVIE_LIST_CALLBACKS[tabIndex]();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.cookie("selectedIndex", tabIndex);

  res.send(renderedHTML);
});

router.get("/now-playing", async (req, res) => {
  const tabIndex = TAB_ROUTES.indexOf(req.url);
  const movieItems = await MOVIE_LIST_CALLBACKS[tabIndex]();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.cookie("selectedIndex", tabIndex);

  res.send(renderedHTML);
});

router.get("/popular", async (req, res) => {
  const tabIndex = TAB_ROUTES.indexOf(req.url);
  const movieItems = await MOVIE_LIST_CALLBACKS[tabIndex]();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.cookie("selectedIndex", tabIndex);

  res.send(renderedHTML);
});

router.get("/top-rated", async (req, res) => {
  const tabIndex = TAB_ROUTES.indexOf(req.url);
  const movieItems = await MOVIE_LIST_CALLBACKS[tabIndex]();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.cookie("selectedIndex", tabIndex);

  res.send(renderedHTML);
});

router.get("/upcoming", async (req, res) => {
  const tabIndex = TAB_ROUTES.indexOf(req.url);
  const movieItems = await MOVIE_LIST_CALLBACKS[tabIndex]();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.cookie("selectedIndex", tabIndex);

  res.send(renderedHTML);
});

export default router;
