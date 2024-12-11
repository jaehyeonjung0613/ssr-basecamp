import { TMDB_MOVIE_DETAIL_URL } from "../../src/constant.js";
import {
  fetchMovie,
  fetchMovies,
  parseMovieDetail,
  parseMovieItems,
} from "../apis/movie.js";

export const getPopular = async () => {
  const data = await fetchMovies();
  return parseMovieItems(data.results);
};

export const getMovieDetail = async (id) => {
  const data = await fetchMovie(TMDB_MOVIE_DETAIL_URL + id);
  return parseMovieDetail(data);
};
