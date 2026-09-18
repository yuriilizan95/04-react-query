import axios from "axios";

import type { Movie } from '../types/movie';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN

export interface MoviesHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const apiClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: 'application/json',
    },
});

export const fetchMovies = async (query: string, page: number): Promise<MoviesHttpResponse> => {
    const response = await apiClient.get<MoviesHttpResponse>('/search/movie', {
        params: {
            query,
            page
        },
    });

    return response.data
}