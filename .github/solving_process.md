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
