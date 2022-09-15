import { useMemo } from "react"
import { useLocation } from "react-router-dom"

const useMigration = () => {
  const location = useLocation()
  const isMigrationPage = useMemo(() => {
    return location.pathname === "/migration"
  }, [location])

  return { isMigrationPage }
}

export default useMigration
