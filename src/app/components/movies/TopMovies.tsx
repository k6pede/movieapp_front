'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './TopMovies.module.scss'
import ExpandMovieCard from '../ExpandMovieCard/ExpandMovieCard';

const BLOCK_NAME = 'movies'
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
async function fetchMovies(url: string, page: number) {
    const response = await fetch(`${url}/movie/top/${page}`);
    const data = await response.json();
    return data.results;
}

interface Movie {
    adult: boolean
    backdrop_path: string
    genre_ids: string[]
    id: number
    original_language : string
    original_title : string
    overview: string
    popularity: number
    poster_path: string
    release_date: Date
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}
export default function TopMovies() {
    const [page, setPage] = useState(1)
    const [movies, setMovies] = useState<Movie[]>([])
    // 指定した要素の状態を監視するHooks　containerRef を使用してスクロールイベントをコンテナにアタッチ
    const containerRef = useRef<HTMLDivElement>(null);

    const loadingRef = useRef(false);
    // const timeoutRef = useRef(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        async function fetchMovies(url: string, page: number) {
            const response = await fetch(`${url}/movie/top/${page}`);
            const data = await response.json();
            return data.results;
        }

        async function loadMovies() {
            if (!loadingRef.current) {
                loadingRef.current = true
                const fetchedMovies = await fetchMovies(baseUrl, page);
                setMovies(prevMovies => [...prevMovies, ...fetchedMovies]);
                loadingRef.current = false
            }
        }

        loadMovies();

    }, [page]);

    // 横スクロールの監視
    useEffect(() => {
        // useRefで監視している要素が一定条件を満たしたらデータを取得する
        const handleScroll = () => {
            const container = containerRef.current;
            if (container && container.scrollWidth - container.scrollLeft - container.clientWidth < 100 && !loadingRef.current) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setPage(prevPage => prevPage + 1);
                }, 200);  // Debounce time of 200 milliseconds
            }
        };

        containerRef.current?.addEventListener('scroll', handleScroll);

        // クリーンアップ処理
        return () => {
            containerRef.current?.removeEventListener('scroll', handleScroll);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            {movies.map((movie: any, index) =>
                <div className={styles.card} key={`${movie.original_title}`}>
                    <ExpandMovieCard movie={movie} />
                </div>
            )}
        </div>
    )
}
