'use client'

import { useEffect, useState } from 'react';
import styles from './TopMovies.module.scss'
import ExpandMovieCard from '../ExpandMovieCard/ExpandMovieCard';

const BLOCK_NAME = 'movies'
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
async function fetchMovies(url: string, page: number) {
    const response = await fetch(`${url}/movie/top/${page}`);
    const data = await response.json();
    return data.results;
}


export default function TopMovies() {
    const [page, setPage] = useState(1)
    const [movies, setMovies] = useState([])

    useEffect(() => {
        async function fetchMovies(url: string, page: number) {
            const response = await fetch(`${url}/movie/top/${page}`);
            const data = await response.json();
            return data.results;
        }

        async function loadMovies() {
            const fetchedMovies = await fetchMovies(baseUrl, page);
            setMovies(fetchedMovies);
        }

        loadMovies();
    }, [page]);

    return (
        <div className={styles.container}>
            {movies.map((movie: any, index) =>
                <div className={styles.card} key={`${movie.original_title}`}>
                    <ExpandMovieCard movie={movie} />
                </div>
            )}
        </div>
    )
}
