import { FETCH_OPTIONS } from "../../src/constant.js";

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

export const fetchMovies = async (url) => {
  const response = await fetch(url, FETCH_OPTIONS);

  return await response.json();
};

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
