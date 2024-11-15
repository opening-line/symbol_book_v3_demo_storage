import { useState, useEffect } from "react"

const uniqueKey = "private-key-7975FE354EC321E6"

function usePrivateKeyStorage() {
  const [storedValue, setStoredValue] = useState<string | null>(() => {
    try {
      const item = window.localStorage.getItem(uniqueKey)
      return item ? item : null
    } catch (error) {
      throw new Error("Failed to retrieve item from localStorage")
    }
  })

  const setValue = (value: string | ((val: string | null) => string)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(uniqueKey, valueToStore)
    } catch (error) {
      throw new Error("Failed to set item in localStorage")
    }
  }

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(uniqueKey)
      if (storedValue) {
        setStoredValue(storedValue)
      } else {
        setStoredValue(null)
      }
    } catch (error) {
      throw new Error("Failed to retrieve item from localStorage in useEffect")
    }
  }, [uniqueKey])

  return [storedValue, setValue] as const
}

export default usePrivateKeyStorage
