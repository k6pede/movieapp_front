interface SectionTitle {
    title: string
}

export default function SectionTitle (
    sectionTitle : string
) {
    return (
        <div>
            <div>
                <div>
                    {sectionTitle}
                </div>
            </div>
        </div>
    )
}