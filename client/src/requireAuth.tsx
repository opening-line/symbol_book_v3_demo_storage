import { Navigate } from "react-router-dom"
import usePrivateKeyStorage from "./hooks/usePrivateKeyStorage.ts"
import isValidPrivateKey from "./utils/isValidPrivateKey.ts"
import { useMemo } from "react"

const requireAuth = (element: JSX.Element) => {
  const [privateKey] = usePrivateKeyStorage()

  const isAuthenticated = useMemo(() => {
    return privateKey ? isValidPrivateKey(privateKey) : false
  }, [privateKey])

  return isAuthenticated ? element : <Navigate to='/' />
}

export default requireAuth
