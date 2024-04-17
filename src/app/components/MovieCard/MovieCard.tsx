import Image from 'next/image'
import styles from './style.module.scss'

const BLOCK_NAME = 'movies'
const IMAGE_PATH = `https://image.tmdb.org/t/p/w300_and_h450_bestv2/`

async function MovieCard({
    movie
}:{
    movie : any
}) {
    return (
        <>
            <div key={movie.id} className={styles[`${BLOCK_NAME}-item`]}>
                <p className="text">{movie.original_title}</p>
                <Image src={`${IMAGE_PATH}${movie.poster_path}`} alt="Movie Poster" width={200} height={200}/>
            </div>
        </>
    )
}

export default MovieCard