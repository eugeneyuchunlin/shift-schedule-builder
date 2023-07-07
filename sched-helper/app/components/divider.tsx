import styles from './divider.module.css'

export default function Divider ({text}: {text: string}){
    return (
        <div className={styles.separator}>
            {text}
        </div>
    )
}