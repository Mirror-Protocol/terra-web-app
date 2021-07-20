import { ChangeEvent, useState } from "react"

import { useProtocol } from "../../data/contract/protocol"
import useURL from "../../hooks/useURL"

import Page from "../../components/Page"
import Grid, { Gutter } from "../../components/Grid"
import Card from "../../components/Card"
import Table from "../../components/Table"
import FormCheck from "../../components/FormCheck"
import ExtLink from "../../components/ExtLink"
import Button from "../../components/Button"
import Icon from "../../components/Icon"
import Pre from "../../components/Pre"

const Tool = () => {
  const { contracts, listed, whitelist, getToken } = useProtocol()
  const { pair: mirrorPair } = whitelist[getToken("MIR")]

  /* input */
  const [contract, setContract] = useState<string>(mirrorPair)
  const [message, setMessage] = useState<string>('{ "pool": {} }')
  const getURL = useURL()
  const url = getURL(contract, message)

  /* output */
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>()

  /* fetch */
  const query = async () => {
    try {
      setLoading(true)
      const response = await fetch(url)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult(error)
    } finally {
      setLoading(false)
    }
  }

  /* form */
  const getRadio = (label: string, address: string) => ({
    label,
    attrs: {
      type: "radio",
      id: address,
      name: "contract",
      value: address,
      checked: address === contract,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        setContract(e.target.value),
    },
  })

  return (
    <Page title="Tool">
      <Grid>
        <Card title="Contracts">
          <FormCheck
            list={Object.entries(contracts).map(([label, address]) =>
              getRadio(label, address)
            )}
          />

          <input
            value={contract}
            onChange={(e) => setContract(e.target.value)}
            style={{ ...styles.input, marginTop: 5 }}
          />
        </Card>

        {(["token", "pair", "lpToken"] as (keyof ListedItem)[]).map((key) => (
          <Card title={key} key={key}>
            <FormCheck
              list={listed.map((item) => getRadio(item.symbol, item[key]))}
            />
          </Card>
        ))}
      </Grid>

      <Gutter>
        <Card title="Query" full>
          <div style={{ display: "flex", padding: "10px 15px" }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.input}
              rows={3}
            />
          </div>
        </Card>
      </Gutter>

      <Gutter>
        <Card
          title="URL"
          action={
            contract && (
              <Button onClick={query} size="xs" color="secondary" outline>
                <Icon name="ChevronRight" size={8} />
              </Button>
            )
          }
          loading={loading}
        >
          {contract && <ExtLink href={url}>{url}</ExtLink>}

          <Pre>{result}</Pre>
        </Card>
      </Gutter>

      <Gutter>
        <Table
          rowKey="token"
          columns={[
            { key: "symbol" },
            { key: "token" },
            { key: "pair" },
            { key: "lpToken" },
          ]}
          dataSource={listed}
        />
      </Gutter>
    </Page>
  )
}

export default Tool

const styles = {
  input: {
    background: "#0003",
    borderRadius: 5,
    padding: "5px 10px",
    width: "100%",
  },
}
