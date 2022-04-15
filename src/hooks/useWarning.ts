import createContext from "./createContext"

const warningModal = createContext<Modal>("warningModal")
export const [useWarningModal] = warningModal
