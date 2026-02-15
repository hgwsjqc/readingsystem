// Loading.js
import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.overlay}> {/* 全屏遮罩层 */}
      <div className={styles.container}> {/* 精确居中容器 */}
        <div className={styles.ball}></div>
        <div className={styles.ball}></div>
      </div>
    </div>
  )
}