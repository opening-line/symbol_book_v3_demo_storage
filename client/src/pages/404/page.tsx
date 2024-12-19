import React from "react"
import { Link } from "react-router-dom"
import styles from "./page.module.css"

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textCenter}>
        <h1 className={styles.errorCode}>404</h1>
        <p className={styles.message}>Page Not Found</p>
        <p className={styles.description}>
          申し訳ありませんが、お探しのページは見つかりませんでした。
        </p>
        <Link
          to='/'
          className={styles.linkButton}
          onMouseOver={(e) =>
            e.currentTarget.classList.add(styles.linkButtonHover)
          }
          onMouseOut={(e) =>
            e.currentTarget.classList.remove(styles.linkButtonHover)
          }
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
