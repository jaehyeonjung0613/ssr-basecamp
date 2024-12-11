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
