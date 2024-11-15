import { Navigate } from "react-router-dom"
import usePrivateKeyStorage from "./hooks/usePrivateKeyStorage.ts"
import isValidPrivateKey from "./utils/isValidPrivateKey.ts"

const requireAuth = (element: JSX.Element) => {
  const [privateKey] = usePrivateKeyStorage()
  const isAuthenticated = privateKey ? isValidPrivateKey(privateKey) : false

  return isAuthenticated ? element : <Navigate to='/' />
}

export default requireAuth
