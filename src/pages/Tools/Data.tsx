import { useState } from "react"
import { is } from "ramda"
import { useProtocol } from "../../data/contract/protocol"
import Page from "../../components/Page"
import { Gutter } from "../../components/Grid"
import Card from "../../components/Card"
import Icon from "../../components/Icon"
import Button from "../../components/Button"

interface Props {
  title: string
  content: string | object
}

const Item = ({ title, content }: Props) => {
  const { getSymbol } = useProtocol()
  const [verbose, setVerbose] = useState(false)
  const toggle = () => setVerbose(!verbose)

  const collapsed =
    is(Object, content) &&
    (Object.values(content).some(is(Object)) ||
      Object.values(content).length > 3)

  const symbol = getSymbol(title)
  const affix = symbol ? ` (${symbol})` : ``

  return (
    <article key={title}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>
          {title}
          {affix}
        </h1>

        {collapsed && (
          <Button onClick={toggle} color="secondary" size="xs" outline>
            <Icon name={verbose ? "ChevronUp" : "ChevronDown"} size={8} />
          </Button>
        )}
      </header>

      <pre>{JSON.stringify(content, null, verbose ? 2 : 0)}</pre>
    </article>
  )
}

const Data = () => {
  const dictionary: Dictionary = {}

  return (
    <Page title="Data">
      {Object.entries(dictionary).map(([key, value]) => (
        <Gutter key={key}>
          <Card title={key}>
            {value &&
              Object.entries(value).map(([key, value]) => (
                <Item title={key} content={value} key={key} />
              ))}
          </Card>
        </Gutter>
      ))}
    </Page>
  )
}

export default Data
