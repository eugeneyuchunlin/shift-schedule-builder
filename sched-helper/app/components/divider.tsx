import styles from './divider.module.css'

export default function Divider ({text, className}: {text: string, className?: string}){
    return (
        <div className={`${styles.separator} ${className}`}>
            {text}
        </div>
    )
}