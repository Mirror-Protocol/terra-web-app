import { ChangeEvent, useState } from "react"
import { useRecoilValue } from "recoil"
import { request } from "graphql-request"

import { format } from "../../libs/parse"
import { statsURLQuery } from "../../data/network"
import * as gqldocs from "../../data/stats/gqldocs"

import Page from "../../components/Page"
import Grid, { Gutter } from "../../components/Grid"
import Card from "../../components/Card"
import FormCheck from "../../components/FormCheck"
import Button from "../../components/Button"
import Icon from "../../components/Icon"
import Pre from "../../components/Pre"

const { ASSETS, STATISTIC, ...rest } = gqldocs
const docs: Dictionary = { ...ASSETS, ...STATISTIC, ...rest }
const [initialKey, initialDoc] = Object.entries(docs)[0]

const GraphQL = () => {
  /* input */
  const [key, setKey] = useState<string>(initialKey)
  const [doc, setDoc] = useState<string>(initialDoc)
  const [variables, setVariables] = useState<string>('{ "network": "COMBINE" }')

  /* output */
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>()

  /* measure */
  const [start, setStart] = useState<number>()
  const [end, setEnd] = useState<number>()
  const diff = start && end ? end - start : undefined

  /* fetch */
  const url = useRecoilValue(statsURLQuery)
  const query = async () => {
    setStart(undefined)
    setEnd(undefined)

    try {
      setLoading(true)
      setStart(Date.now())
      const data = await request(url, doc, JSON.parse(variables))
      setEnd(Date.now())
      setResult(data)
    } catch (error) {
      setResult(error)
    } finally {
      setLoading(false)
    }
  }

  /* form */
  const getRadio = (label: string) => ({
    label,
    attrs: {
      type: "radio",
      id: label,
      name: "contract",
      value: label,
      checked: label === key,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setKey(value)
        setDoc(docs[value])
      },
    },
  })

  return (
    <Page title="GraphQL">
      <Grid>
        <textarea
          value={doc}
          onChange={(e) => {
            setKey("")
            setDoc(e.target.value)
          }}
          style={styles.input}
          rows={20}
        />

        <section>
          <FormCheck list={Object.keys(docs).map((label) => getRadio(label))} />
          <textarea
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            style={styles.input}
            rows={3}
          />
        </section>
      </Grid>

      <Gutter>
        <Card
          title={diff ? format(String(diff)) + "ms" : "Result"}
          action={
            <Button onClick={query} size="xs" color="secondary" outline>
              <Icon name="ChevronRight" size={8} />
            </Button>
          }
          loading={loading}
        >
          <Pre>{result}</Pre>
        </Card>
      </Gutter>
    </Page>
  )
}

export default GraphQL

const styles = {
  input: {
    background: "#0003",
    borderRadius: 5,
    fontFamily: "Source Code Pro, monospace",
    padding: "5px 10px",
    width: "100%",
  },
}
