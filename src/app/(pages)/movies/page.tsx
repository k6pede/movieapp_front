import TopMovies from "@/app/components/movies/TopMovies";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TopMovies />
        </Suspense>
    )
}