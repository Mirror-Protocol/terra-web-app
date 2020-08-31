import { ReactNode } from "react"
import classNames from "classnames/bind"
import { path } from "ramda"
import styles from "./Table.module.scss"

const cx = classNames.bind(styles)

interface Props<T> {
  rows?: (record: T) => Row
  columns: Column<T>[]
  dataSource: T[]
}

interface Row {
  background?: string
}

interface Column<T> {
  key: string
  title?: ReactNode
  dataIndex?: string
  render?: (value: any, record: T, index: number) => ReactNode
  children?: Column<T>[]

  colSpan?: number
  className?: string
  align?: "left" | "right" | "center"
  fixed?: "left" | "right"
  narrow?: string[]
  border?: BorderPosition[]
  bold?: boolean
  width?: string | number
}

enum BorderPosition {
  LEFT = "left",
  RIGHT = "right",
}

const SEP = "."

type DefaultRecordType = Record<string, any>
function Table<T extends DefaultRecordType>(props: Props<T>) {
  const { rows, columns, dataSource } = props

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
    const { key, title, colSpan, width } = column
    return (
      <th
        className={classNames(getClassName(column), styles.th)}
        colSpan={colSpan}
        style={{ width }}
        key={key}
      >
        {title ?? key}
      </th>
    )
  }

  const colspan = columns.some(({ children }) => children)
  return !dataSource.length ? null : (
    <div className={styles.wrapper}>
      <table className={cx({ margin: colspan })}>
        <thead>
          {colspan && (
            <tr className={cx({ colspan })}>{columns.map(renderColSpan)}</tr>
          )}

          <tr>{normalized.map(renderTh)}</tr>
        </thead>

        <tbody>
          {dataSource.map((record, index) => {
            const renderTd = (column: Column<T>): ReactNode => {
              const { key, dataIndex, render } = column
              const { className, bold, width } = column
              const value = path<any>((dataIndex ?? key).split(SEP), record)
              const tdClassName = cx({ bold }, styles.td, className)

              return (
                <td
                  className={classNames(getClassName(column), tdClassName)}
                  style={{ width }}
                  key={key}
                >
                  {render?.(value, record, index) ?? value}
                </td>
              )
            }

            return (
              <tr className={cx(rows?.(record).background)} key={index}>
                {normalized.map(renderTd)}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
