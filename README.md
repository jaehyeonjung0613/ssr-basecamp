# 🚀 프론트엔드 SSR 베이스캠프

## ⛳️ 학습 목표

- CSR과 SSR 렌더링 방식의 특징을 이해하고, 주어진 상황에 적합한 렌더링 방식을 선택할 수 있다.
- **전통적인 서버 사이드 렌더링 방식을 경험해 본 미션 수행을 위한 배경 지식을 쌓는다.**

## ✅ 미션을 시작하기 전에...

몇 가지 계정 생성이 필요합니다.

- TMDB API 키 발급을 위해 [TMDB API 키 발급](https://www.themoviedb.org/settings/api) 후 진행하세요.

  - 발급한 키는 루트 경로에 `.env`파일을 만들어 키에 따른 토큰 값으로 설정해주세요

  ```
  // csr/.env
  VITE_TMDB_TOKEN=발급받은_API_KEY
  // ssr/.env
  TMDB_TOKEN=발급받은_API_KEY
  ```

## 📅 **진행 방식**

- 사전 미션은 페어 없이 진행합니다.
- 본 저장소를 fork하여 각자 작업을 진행하고, PR을 올립니다.
- ssr 디렉터리에서 `npm run start` 또는 `npm run dev`로 기능이 잘 동작한다면 미션 요구사항을 완수한 것으로 봅니다.

## 💡 **참고사항**

- `csr/` 이하 디렉터리를 참고하여 영화 정보 앱이 동작하는 방식을 확인합니다.
- 필요하다면, `static/` 이하 디렉터리를 참고하여 영화 정보 앱을 SSR방식으로 전환하는 데 참고하여 활용할 수 있습니다.

  ## 🧩 풀이 과정

[solving_process.md](https://github.com/jaehyeonjung0613/ssr-basecamp/blob/main/.github/solving_process.md)
