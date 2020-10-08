import useLocalStorage from "../libs/useLocalStorage"
import createContext from "./createContext"

interface Settings {
  hasAgreed: boolean
  agree: () => void
}

const context = createContext<Settings>("useSettings")
export const [useSettings, SettingsProvider] = context

/* state */
export const useSettingsState = (): Settings => {
  const [hasAgreed, setHasAgreed] = useLocalStorage("agreement", false)
  return { hasAgreed, agree: () => setHasAgreed(true) }
}
