import useLocalStorage, { LocalStorage } from "../libs/useLocalStorage"
import createContext from "./createContext"

interface Settings {
  agreementState: LocalStorage<boolean>
}

const context = createContext<Settings>("useSettings")
export const [useSettings, SettingsProvider] = context

/* state */
export const useSettingsState = (): Settings => {
  const agreementState = useLocalStorage("agreement", false)
  return { agreementState }
}
