import React from "react"
import styles from "./TitleSection.module.css"

interface Props {
  children: React.ReactNode
}

const TitleSection: React.FC<Props> = ({ children }) => {
  return <h1 className={styles.title}>{children}</h1>
}

export default TitleSection
