// 'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import styles from './style.module.scss'
import MovieCard from '../MovieCard/MovieCard';
import ExMovieCard from '../ExpandMovieCard/ExpandMovieCard';

const BLOCK_NAME = 'movies'

async function TopMovies() {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

    const response = await fetch(url + '/movie/top').then((response) => response.json())
    const movies = response.results



    return (
        <div className={styles[`${BLOCK_NAME}-div`]}>
            {movies.map((movie: any) =>
                <ExMovieCard movie={movie} />
            )}
        </div>
    )
}

export default TopMovies