import React from "react"

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className='container mx-auto text-center pt-4'>
      {children}
    </div>
  )
}

export default Container
