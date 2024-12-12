import { TMDB_MOVIE_DETAIL_URL, TMDB_MOVIE_LISTS } from "../../src/constant.js";
import {
  fetchMovie,
  fetchMovies,
  parseMovieDetail,
  parseMovieItems,
} from "../apis/movie.js";

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

export const getMovieDetail = async (id) => {
  const data = await fetchMovie(TMDB_MOVIE_DETAIL_URL + id);
  return parseMovieDetail(data);
};
