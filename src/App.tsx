import Links from "./Links"
import { ReactComponent as Logo } from "./Logo.svg"
import styles from "./App.module.scss"

const App = () => {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Logo />
        <h1 className={styles.title}>Mirror Protocol</h1>
        <p className="muted">
          Choose any link below to access the decentralized web app
        </p>
      </header>

      <section>
        <Links />
      </section>
    </main>
  )
}

export default App
