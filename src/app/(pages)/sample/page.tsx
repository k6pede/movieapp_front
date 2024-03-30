import  Sample from "@/app/components/sample/Sample"
import { Suspense } from "react"

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Sample/>
        </Suspense>
    )
}