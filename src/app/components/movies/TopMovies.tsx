'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './TopMovies.module.scss'
import ExpandMovieCard from '../ExpandMovieCard/ExpandMovieCard'
import { Movie } from '@/app/types'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
/** 映画情報を取得する */
async function fetchMovies(url: string, page: number) {
  const response = await fetch(`${url}/movie/top/${page}`)
  const data = await response.json()
  return data.results
}

export default function TopMovies() {
  // スクロール量でfetchするための状態管理や処理
  const [page, setPage] = useState(1)
  const [movies, setMovies] = useState<Movie[]>([])
  // 指定した要素の状態を監視するHooks　containerRef を使用してスクロールイベントをコンテナにアタッチ
  const containerRef = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState('right')

  const MAX_ITEMS = 40
  const ITEMS_PER_PAGE = 20

  const loadingRef = useRef(false)
  // const timeoutRef = useRef(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function loadMovies() {
      if (!loadingRef.current) {
        loadingRef.current = true
        const fetchedMovies = await fetchMovies(baseUrl, page)

        if (direction === 'right') {
          console.log('right')
          setMovies((prevMovies) => [...prevMovies, ...fetchedMovies].slice(-MAX_ITEMS))
        } else if (direction === 'left') {
          console.log('left')
          setMovies((prevMovies) => [...fetchedMovies, ...prevMovies].slice(0, MAX_ITEMS))
        }

        loadingRef.current = false
      }
    }
    console.log(movies)

    loadMovies()
  }, [page])

  // 横スクロールの監視
  useEffect(() => {
    let lastScrollLeft = 0
    // useRefで監視している要素が一定条件を満たしたらデータを取得する
    const handleScroll = () => {
      const container = containerRef.current
      if (!container || loadingRef.current) return

      const currentScrollLeft = container.scrollLeft
      const scrollLeft = container.scrollLeft < 100
      const scrollRight = container.scrollWidth - container.scrollLeft - container.clientWidth < 100

      const scrollDirection = currentScrollLeft > lastScrollLeft ? 'right' : 'left'
      lastScrollLeft = currentScrollLeft
      console.log('scrollDirection', scrollDirection)

      if (
        scrollDirection === 'right' &&
        scrollRight &&
        page < Math.ceil(MAX_ITEMS / ITEMS_PER_PAGE)
      ) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          setPage((prevPage) => prevPage + 1)
          setDirection('right')
        }, 200)
      } else if (scrollDirection === 'left' && scrollLeft && page > 1) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          setPage((prevPage) => prevPage - 1)
          setDirection('left')
        }, 200)
      }
    }

    containerRef.current?.addEventListener('scroll', handleScroll)

    // クリーンアップ処理
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className={styles.container} ref={containerRef}>
      {movies.map((movie: Movie) => (
        <div className={styles.card} key={`${movie.original_title}`}>
          <ExpandMovieCard movie={movie} />
        </div>
      ))}
    </div>
  )
}
