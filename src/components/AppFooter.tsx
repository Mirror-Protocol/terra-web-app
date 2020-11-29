import Container from "./Container"
import ExtLink from "./ExtLink"
import Icon from "./Icon"
import styles from "./AppFooter.module.scss"

interface Props {
  network?: string
  community?: { href: string; src: string; alt: string }[]
}

const AppFooter = ({ network, community }: Props) => (
  <footer className={styles.footer}>
    <Container className={styles.container}>
      {network && (
        <section className={styles.network}>
          <Icon name="wifi_tethering" size={20} />
          {network}
        </section>
      )}

      {community && (
        <section className={styles.community}>
          {community.map(
            ({ href, src, alt }) =>
              href && (
                <ExtLink href={href} className={styles.link} key={alt}>
                  <img src={src} alt={alt} width={20} height={20} />
                </ExtLink>
              )
          )}
        </section>
      )}
    </Container>
  </footer>
)

export default AppFooter
