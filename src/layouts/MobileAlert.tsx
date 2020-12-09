import MESSAGE from "../lang/MESSAGE.json"
import useLocalStorage from "../libs/useLocalStorage"
import Alert from "../components/Alert"

const MobileAlert = () => {
  const [hide, setHide] = useLocalStorage("hideMobileAlert", false)

  return (
    <Alert isOpen={!hide} onClose={() => setHide(true)}>
      {MESSAGE.App.Mobile}
    </Alert>
  )
}

export default MobileAlert
