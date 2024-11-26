import React from "react"

interface ContainerProps {
  children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className='container mx-auto pt-4 pb-10'>{children}</div>
  )
}

export default Container
