import { Suspense } from "react"

async function TopMovies() {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const response = await fetch(url + '/movie/top').then((response) => response.json())
    const movies = response.info.results

    const imagePath = `https://image.tmdb.org/t/p/w300_and_h450_bestv2/`

    console.log(typeof(movies))

    return (
        <div>
            {movies.map((movie: any) =>
            <div>
                <p className="text" key={movie.id}>{movie.original_title}</p>
                <img src={imagePath + movie.poster_path} alt="Movie Poster" />
            </div>
            )}
        </div>
    )
}

export default TopMovies