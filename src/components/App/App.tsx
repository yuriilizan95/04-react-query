import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { fetchMovies, type MoviesHttpResponse } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import css from "./App.module.css"

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;


export default function App() {
 const  [page, setPage] = useState(1)
  const [query, setQuery] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

 const {
    data,
    isLoading,
    isError,
  } = useQuery<MoviesHttpResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: Boolean(query.trim()),
    placeholderData: keepPreviousData,
  });
  
  const movies = data?.results ?? [];
const totalPages = data?.total_pages ?? 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />
      {data && <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />}
      {isLoading && <Loader />}
      {isError && !isLoading && <ErrorMessage />}
      {movies.length > 0 && !isLoading && !isError && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}