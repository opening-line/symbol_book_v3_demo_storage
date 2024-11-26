import React from "react"

interface Props {
  children: React.ReactNode
}

const TitleSection: React.FC<Props> = ({ children }) => {
  return <h1 className='text-2xl font-bold mb-8'>{children}</h1>
}

export default TitleSection
