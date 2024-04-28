import styles from './PageTitle.module.scss'

interface TitleProps {
    title : string
}

export default function PageTitle ({title}: TitleProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.title}>
                    {title}
                </div>
            </div>
        </div>
    )
}