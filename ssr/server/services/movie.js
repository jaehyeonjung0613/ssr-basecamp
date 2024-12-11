import { fetchMovies, parseMovieItems } from "../apis/movie.js";

export const getPopular = async () => {
  const data = await fetchMovies();
  return parseMovieItems(data.results);
};
