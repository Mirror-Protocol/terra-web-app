const Pre = ({ children }: { children: any }) => (
  <pre>{stringify(children)}</pre>
)

export default Pre

/* helpers */
const stringify = (param: any) => {
  try {
    return JSON.stringify(param, null, 2)
  } catch (error) {
    return param
  }
}
