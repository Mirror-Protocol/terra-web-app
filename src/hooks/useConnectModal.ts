import createContext from "./createContext"

const connectModal = createContext<Modal>("connectWalletModal")
export const [useConnectModal, ConnectModalProvider] = connectModal
