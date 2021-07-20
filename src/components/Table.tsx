import { ReactNode } from "react"
import { useHistory } from "react-router-dom"
import classNames from "classnames/bind"
import { isNil, path } from "ramda"
import { LocationDescriptor } from "history"
import styles from "./Table.module.scss"

const cx = classNames.bind(styles)

interface Props<T> {
  caption?: ReactNode
  rowKey: keyof T
  rows?: (record: T) => Row
  columns: Column<T>[]
  dataSource: T[]
  config?: {
    hideHeader?: boolean
    noRadius?: boolean
    darker?: boolean
  }
}

interface Row {
  background?: string
  to?: LocationDescriptor
}

interface Cell {
  background?: string
  to?: LocationDescriptor
}

interface Column<T> {
  key: string
  title?: ReactNode | ReactNode[]
  dataIndex?: string
  render?: (value: any, record: T, index: number) => ReactNode | ReactNode[]
  cell?: (value: any, record: T, index: number) => Cell
  children?: Column<T>[]

  colSpan?: number
  className?: string
  align?: "left" | "right" | "center"
  fixed?: "left" | "right"
  narrow?: string[]
  border?: BorderPosition[]
  bold?: boolean
  width?: string | number
  desktop?: boolean
}

enum BorderPosition {
  LEFT = "left",
  RIGHT = "right",
}

const SEP = "."

type DefaultRecordType = Record<string, any>
function Table<T extends DefaultRecordType>(props: Props<T>) {
  const { caption, rowKey, rows, columns, dataSource, config } = props
  const { push } = useHistory()

  const normalized = columns.reduce<Column<T>[]>(
    (acc, { children, ...column }) => {
      // Normalize nested columns below `children`
      // The first child draws the left border
      // The last child draws the right border.
      const renderChild = (child: Column<T>, index: number) => ({
        ...child,
        key: [column.key, child.key].join(SEP),
        border: !index
          ? [BorderPosition.LEFT]
          : index === children!.length - 1
          ? [BorderPosition.RIGHT]
          : undefined,
      })

      return !children
        ? [...acc, column]
        : [...acc, ...children.map(renderChild)]
    },
    []
  )

  const getClassName = ({ align, fixed, narrow, border }: Column<T>) => {
    const alignClassName = `text-${align}`
    const fixedClassName = `fixed-${fixed}`
    const borderClassName = cx(border?.map((position) => `border-${position}`))
    const narrowClassName = cx(narrow?.map((position) => `narrow-${position}`))

    return cx(
      styles.cell,
      alignClassName,
      fixedClassName,
      borderClassName,
      narrowClassName
    )
  }

  const renderColSpan = (column: Column<T>) => {
    // children: colspan attribute, border props
    // No children: empty the title
    const { children } = column
    const colSpan = children?.length
    const next = Object.assign(
      { ...column, colSpan, children: undefined },
      children
        ? { border: [BorderPosition.LEFT, BorderPosition.RIGHT] }
        : { title: "" }
    )

    return renderTh(next)
  }

  const renderTh = (column: Column<T>): ReactNode => {
    const { key, title, colSpan, width, desktop } = column
    return (
      <th
        className={cx(getClassName(column), styles.th, { desktop })}
        colSpan={colSpan}
        style={{ width }}
        key={key}
      >
        {!isNil(title) ? (
          Array.isArray(title) ? (
            <ul>
              {title.map((title, index) => (
                <li key={index}>{title}</li>
              ))}
            </ul>
          ) : (
            title
          )
        ) : (
          key
        )}
      </th>
    )
  }

  const colspan = columns.some(({ children }) => children)
  return (
    <div className={cx(styles.wrapper, { radius: !config?.noRadius })}>
      <table className={cx({ margin: colspan, darker: config?.darker })}>
        {caption && (
          <caption
            className={cx(styles.caption, { border: !config?.hideHeader })}
          >
            {caption}
          </caption>
        )}

        {!!dataSource.length && (
          <>
            {!config?.hideHeader && (
              <thead>
                {colspan && (
                  <tr className={cx({ colspan })}>
                    {columns.map(renderColSpan)}
                  </tr>
                )}

                <tr>{normalized.map(renderTh)}</tr>
              </thead>
            )}

            <tbody>
              {dataSource.map((record, index) => {
                const renderTd = (column: Column<T>): ReactNode => {
                  const { key, dataIndex, render, cell: getCell } = column
                  const { className, bold, width, desktop } = column
                  const value = path<any>((dataIndex ?? key).split(SEP), record)
                  const tdClassName = cx(
                    { bold, desktop },
                    styles.td,
                    className
                  )

                  const content = render?.(value, record, index)
                  const cell = getCell?.(value, record, index)

                  return (
                    <td
                      className={cx(
                        getClassName(column),
                        cell?.background,
                        { clickable: cell?.to },
                        tdClassName
                      )}
                      onClick={() => cell?.to && push(cell.to)}
                      style={{ width }}
                      key={key}
                    >
                      {render ? (
                        Array.isArray(content) ? (
                          <ul>
                            {content.map((content, index) => (
                              <li className={cx({ sub: index })} key={index}>
                                {content}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          content
                        )
                      ) : (
                        value
                      )}
                    </td>
                  )
                }

                const row = rows?.(record)

                return (
                  <tr
                    className={cx(row?.background, { clickable: row?.to })}
                    onClick={() => row?.to && push(row.to)}
                    key={record[rowKey]}
                  >
                    {normalized.map(renderTd)}
                  </tr>
                )
              })}
            </tbody>
          </>
        )}
      </table>
    </div>
  )
}

export default Table
