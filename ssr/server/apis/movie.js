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
