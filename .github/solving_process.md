# 🧐 memegle 프로젝트 성능 개선하기 풀이

[우아한테크코스](https://github.com/woowacourse) 프론트 SSR 베이스 캠프 문제 중 [프론트엔드 SSR 베이스캠프](https://github.com/woowacourse/ssr-basecamp) 풀이 기록하기.

## 0. 준비

```json
// package.json

{
  "author": "jaehyeonjung0613",
  "homepage": "https://jaehyeonjung0613.github.io/ssr-basecamp"
}
```

forked github repository에 맞춰 author, homepage 수정.

```json
// package.json

{
  "scripts": {
    "start": "node server/index.js NODE_TLS_REJECT_UNAUTHORIZED=0 ",
    "dev": "nodemon server/index.js --watch NODE_TLS_REJECT_UNAUTHORIZED=0 "
  }
}
```

명령어구문 오류 발생 수정.

## 1. TMDB API 요청하기

```js
// src/constants.js

export const BASE_URL = "https://api.themoviedb.org/3/movie";

export const TMDB_THUMBNAIL_URL =
  "https://media.themoviedb.org/t/p/w440_and_h660_face/";
export const TMDB_ORIGINAL_URL = "https://image.tmdb.org/t/p/original/";
export const TMDB_BANNER_URL =
  "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/";
export const TMDB_MOVIE_LISTS = {
  POPULAR: BASE_URL + "/popular?language=ko-KR&page=1",
  NOW_PLAYING: BASE_URL + "/now_playing?language=ko-KR&page=1",
  TOP_RATED: BASE_URL + "/top_rated?language=ko-KR&page=1",
  UPCOMING: BASE_URL + "/upcoming?language=ko-KR&page=1",
};
export const TMDB_MOVIE_DETAIL_URL = "https://api.themoviedb.org/3/movie/";

export const FETCH_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + process.env.TMDB_TOKEN,
  },
};
```

TMDB 요청을 위한 API 항목 정의.

```js
// server/apis/movie.js

import { FETCH_OPTIONS, TMDB_MOVIE_LISTS } from "../../src/constant.js";

export const fetchMovies = async () => {
  const response = await fetch(TMDB_MOVIE_LISTS.POPULAR, FETCH_OPTIONS);

  return await response.json();
};
```

TMDB api 영화목록 호출 코드 작성.

```js
// server/routes/index.js

import { fetchMovies } from "../apis/movie.js";

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
```

영화목록 호출하여 JSON 문자열 형식으로 변환하여 반환.

```html
<!-- views/index.html -->

<!DOCTYPE html>
<html lang="ko">
  <head>
    <script src="../assets/scripts/index.js"></script>
  </head>
  <body>
    <div id="wrap">
      <header>
        <div
          class="background-container"
          style="background-image: url('${background-container}')"
        >
          <div class="top-rated-container">
            <h1 class="logo">
              <img src="../assets/images/logo.png" alt="MovieList" />
            </h1>
            <div class="top-rated-movie">
              <div class="rate">
                <img src="../assets/images/star_empty.png" class="star" />
                <span class="rate-value">${bestMovie.rate}</span>
              </div>
              <div class="title">${bestMovie.title}</div>
              <button class="primary detail">자세히 보기</button>
            </div>
          </div>
        </div>
      </header>

      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="../assets/images/woowacourse_logo.png" width="180" /></p>
      </footer>
    </div>
    <!--${MODAL_AREA}-->
  </body>
</html>
```

모든 에셋 호출에 대해 ../assets/\*\* 형식으로 경로 수정.(uri와 url 맞춤)

```bash
npm run dev
```

<img alt="result_1" src="https://github.com/user-attachments/assets/67ec1b70-48f6-4a37-90e8-1a851e746b9c"/>

JSON 결과 확인.

## 2. TMDB API 응답을 기준으로 클라이언트에 응답할 항목 렌더링하기

```js
// server/services/movie.js

import { FETCH_OPTIONS, TMDB_MOVIE_LISTS } from "../../src/constant.js";

export const parseMovieItems = (moviesData) => {
  if (Array.isArray(moviesData)) {
    return moviesData.map(({ id, title, vote_average, poster_path }) => ({
      id,
      title,
      rate: vote_average,
      thumbnail: poster_path,
    }));
  }
  return [];
};

export const fetchMovies = async () => {
  const response = await fetch(TMDB_MOVIE_LISTS.POPULAR, FETCH_OPTIONS);

  return await response.json();
};
```

영화목록 fetch 데이터에 대한 parser 함수 생성.

```js
// server/services/movie.js

import { fetchMovies, parseMovieItems } from "../apis/movie";

export const getPopular = async () => {
  const data = await fetchMovies();
  return parseMovieItems(data.results);
};
```

인기있는 영화목록만 호출하는 service 함수 생성.

```js
// server/routes/index.js

import { getPopular } from "../services/movie.js";

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
```

영화목록 데이터에 대한 render 함수 생성.

영화목록이 화면에 뿌려질 수 있도록 로직 수정.

```bash
npm run dev
```

<img alt="result_2" src="https://github.com/user-attachments/assets/6076f032-39a2-4c71-8e4a-4f2a2cd68e7c"/>

결과 확인.

## 3. views/index.html 파일을 활용하여 클라이언트에 응답하기

```js
// sever/routes/index.js

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
```

root router 기능 분리를 위해 영화목록 화면을 생성하는 함수 생성.(with best movie 표시)

영화목록 화면은 detail 화면에서 활동될 것이기 때문에 export 처리.

```js
// server/apis/movie.js

export const parseMovieDetail = ({
  id,
  title,
  backdrop_path,
  release_date,
  genres,
  overview,
  vote_average,
  poster_path,
}) => {
  return {
    id,
    title,
    bannerUrl: backdrop_path,
    releaseYear: release_date,
    genres: genres?.map((genre) => genre.name) ?? [],
    description: overview,
    rate: vote_average,
    thumbnail: poster_path,
  };
};

export const fetchMovie = async (url) => {
  const params = new URLSearchParams({
    language: "ko-KR",
  });
  const response = await fetch(url + "?" + params, FETCH_OPTIONS);

  return await response.json();
};
```

TMDB api 영화상세 호출 코드 작성.

영화상세 fetch 데이터에 대한 parser 함수 생성.

```js
// server/services/movie.js

import { TMDB_MOVIE_DETAIL_URL } from "../../src/constant.js";
import {
  fetchMovie,
  fetchMovies,
  parseMovieDetail,
  parseMovieItems,
} from "../apis/movie.js";

export const getMovieDetail = async (id) => {
  const data = await fetchMovie(TMDB_MOVIE_DETAIL_URL + id);
  return parseMovieDetail(data);
};
```

영화상세 정보를 호출하는 service 함수 생성.

```js
// server/routes/detail.js

import { Router } from "express";
import { getMovieDetail, getPopular } from "../services/movie.js";
import { renderMovieItemPage } from "./index.js";

const router = Router();

const renderMovieDetailItem = ({
  title,
  releaseYear,
  genres,
  description,
  thumbnail,
}) => {
  return /*html*/ `
  <div class="modal-background active" id="modalBackground">
    <div class="modal">
    <button class="close-modal" id="closeModal"><img src="../assets/images/modal_button_close.png" /></button>
    <div class="modal-container">
      <div class="modal-image">
        <img src="https://image.tmdb.org/t/p/original/${thumbnail}.jpg" />
      </div>
      <div class="modal-description">
        <h2>${title}</h2>
        <p class="category">${releaseYear} · ${genres.join(", ")}</p>
        <p class="rate"><img src="../assets/images/star_filled.png" class="star" /><span>7.7</span></p>
        <hr />
        <p class="detail">
          ${description}
        </p>
      </div>
    </div>
  </div>
</div>
<!-- 모달 창 닫기 스크립트 -->
<script>
  const modalBackground = document.getElementById("modalBackground");
  const closeModal = document.getElementById("closeModal");
  document.addEventListener("DOMContentLoaded", () => {
    closeModal.addEventListener("click", () => {
      modalBackground.classList.remove("active");
    });
  });
</script>
`;
};

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const movieDetail = await getMovieDetail(id);

  const movieItems = await getPopular();
  const moviesPageTemplate = renderMovieItemPage(movieItems);
  const renderedHTML = moviesPageTemplate.replace(
    "<!--${MODAL_AREA}-->",
    renderMovieDetailItem(movieDetail)
  );

  res.send(renderedHTML);
});

export default router;
```

영화상세 데이터에 대한 render 함수 생성.

id 식별자를 받아 영화상세 데이터를 화면에 뿌림.

```js
// server/index.js

import movieDetailRouter from "./routes/detail.js";

app.use("/detail", movieDetailRouter);
```

movie detail 요청처리 router 추가.

```bash
npm run dev
```

<img alt="result_3" src="https://github.com/user-attachments/assets/cc2c5249-de05-40cc-a049-d678092af210"/>

결과 확인.

## 4. 카테고리별 영화목록 출력하기

```js
// server/apis/movie.js

export const fetchMovies = async (url) => {
  const response = await fetch(url, FETCH_OPTIONS);

  return await response.json();
};
```

영화목록 API URL을 service에서 결정할 수 있도록 수정.

```js
// server/services/movie.js

import { TMDB_MOVIE_DETAIL_URL, TMDB_MOVIE_LISTS } from "../../src/constant.js";

export const getNowPlaying = async () => {
  const data = await fetchMovies(TMDB_MOVIE_LISTS.NOW_PLAYING);
  return parseMovieItems(data.results);
};

export const getPopular = async () => {
  const data = await fetchMovies(TMDB_MOVIE_LISTS.POPULAR);
  return parseMovieItems(data.results);
};

export const getTopRated = async () => {
  const data = await fetchMovies(TMDB_MOVIE_LISTS.TOP_RATED);
  return parseMovieItems(data.results);
};

export const getUpcoming = async () => {
  const data = await fetchMovies(TMDB_MOVIE_LISTS.UPCOMING);
  return parseMovieItems(data.results);
};
```

카테고리별 영화목록을 데이터를 출력하도록 구성.

```js
// server/routes/index.js

import {
  getNowPlaying,
  getPopular,
  getTopRated,
  getUpcoming,
} from "../services/movie.js";

const categories = {
  nowPlaying: "상영 중",
  popular: "인기순",
  topRated: "평점순",
  upcoming: "상영 예정",
};

const TAB_ROUTES = ["/now-playing", "/popular", "/top-rated", "/upcoming"];

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
  ...
  const tabsHTML = renderTabItems(selectedIndex).join("");
  template = template.replace("<!--${TAB_PLACEHOLDER}-->", tabsHTML);

  return template;
};

router.get("/", async (_, res) => {
  const tabIndex = 1;
  const movieItems = await getPopular();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.send(renderedHTML);
});

router.get("/now-playing", async (req, res) => {
  const tabIndex = TAB_ROUTES.indexOf(req.url);
  const movieItems = await getNowPlaying();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.send(renderedHTML);
});

router.get("/popular", async (req, res) => {
  const tabIndex = TAB_ROUTES.indexOf(req.url);
  const movieItems = await getPopular();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.send(renderedHTML);
});

router.get("/top-rated", async (req, res) => {
  const tabIndex = TAB_ROUTES.indexOf(req.url);
  const movieItems = await getTopRated();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.send(renderedHTML);
});

router.get("/upcoming", async (req, res) => {
  const tabIndex = TAB_ROUTES.indexOf(req.url);
  const movieItems = await getUpcoming();
  const renderedHTML = renderMovieItemPage(movieItems, tabIndex);

  res.send(renderedHTML);
});
```

카테고리별 정보와 url 경로를 상수로 선언.

Tab item들을 출력하는 render 함수 생성.

영화목록 화면 출력시 Tab 요소도 같이 출력되도록 수정.

카테고리별 영화목록 데이터 가져오고 화면에 출력하도록 middleware 생성.

```bash
npm run dev
```

<img alt="result_4" src="https://github.com/user-attachments/assets/5ed18507-0263-4adf-85f7-f2fd74a141b6"/>

결과 확인.
