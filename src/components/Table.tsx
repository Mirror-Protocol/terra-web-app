import React, { useEffect } from "react"
import styled, { css } from "styled-components"
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  Column,
  Row,
  usePagination,
  TableOptions,
  TableState,
  useAsyncDebounce,
} from "react-table"

import iconNext from "images/icon-next.svg"
import iconPrev from "images/icon-prev.svg"
import iconUp from "images/icon-arrow-head-up.svg"
import iconDown from "images/icon-arrow-head-down.svg"

type TableProps<T extends object> = {
  data?: T[]
  columns: Column<T>[]
  searchKeyword?: string
  onRowClick?(row: Row<T>): void
  isLoading?: boolean
  wrapperStyle?: React.CSSProperties
  rowStyle?: React.CSSProperties
  headerRowStyle?: React.CSSProperties
  cellStyle?: React.CSSProperties
  onFetchData?(state: TableState<T>): void
} & TableOptions<T>

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  overflow-x: auto;
`

const TableWrapper = styled.table<{ isLoading?: boolean }>`
  border-top: 1px solid #e8e8e8;
  margin-bottom: 14px;
  position: relative;
  width: 100%;
  height: auto;
  table-layout: fixed;
  opacity: ${({ isLoading }) => (isLoading ? 0.5 : 1)};

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    table-layout: auto;
  }
`

const TableRow = styled.tr<{ hoverEffect?: boolean }>`
  width: 100%;
  height: auto;
  border-bottom: 1px solid #e8e8e8;

  transition: all 0.125s ease-in-out;
  ${({ hoverEffect }) =>
    hoverEffect &&
    css`
      &:hover {
        background-color: #0222ba11;
      }
    `}
`

const Cell = styled.td`
  width: 1px;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  white-space: nowrap;

  & a {
    color: #4460e6;
  }
`

const HeaderCell = styled(Cell)`
  font-weight: 700;
  cursor: pointer;
`

type SortIconProps = {
  sortDirection: "desc" | "asc" | undefined | false
}

const SortIcon = styled.div<SortIconProps>`
  width: 6px;
  height: 14px;
  position: relative;
  vertical-align: middle;
  display: inline-block;

  &::before,
  &::after {
    content: "";
    width: 6px;
    height: 6px;
    position: absolute;
    left: 0;
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    opacity: 0.5;
  }

  &::before {
    top: 0;
    background-image: url(${iconUp});
    ${({ sortDirection }) =>
      sortDirection === "asc" &&
      css`
        opacity: 1;
      `}
  }
  &::after {
    bottom: 0;
    background-image: url(${iconDown});
    ${({ sortDirection }) =>
      sortDirection === "desc" &&
      css`
        opacity: 1;
      `}
  }
`

const Pagination = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  user-select: none;
`

const Table = <T extends object>(props: TableProps<T>) => {
  const {
    columns,
    data = [],
    searchKeyword,
    onRowClick,
    isLoading,
    wrapperStyle = {},
    rowStyle = {},
    cellStyle = {},
    headerRowStyle,
    headerCellStyle,
    onFetchData,
    ...rest
  } = props
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    canNextPage,
    canPreviousPage,
    previousPage,
    nextPage,
    pageCount,
    state,
  } = useTable<T>(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
      ...rest,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const onFetchDataDebounced = useAsyncDebounce(
    onFetchData ? onFetchData : () => {},
    200
  )

  useEffect(() => {
    setGlobalFilter(searchKeyword)
  }, [searchKeyword, setGlobalFilter])

  useEffect(() => {
    if (onFetchData) {
      onFetchDataDebounced(state)
    }
  }, [onFetchData, onFetchDataDebounced, state])
  return (
    <div>
      <Wrapper>
        <TableWrapper
          {...getTableProps()}
          style={wrapperStyle}
          isLoading={isLoading}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                style={headerRowStyle || rowStyle}
              >
                {headerGroup.headers.map((column) => {
                  return (
                    <HeaderCell
                      {...column.getHeaderProps(
                        !props.manualPagination
                          ? column.getSortByToggleProps()
                          : undefined
                      )}
                      colSpan={undefined}
                      style={{
                        ...(headerCellStyle || cellStyle),
                        ...(column.width ? { width: column.width } : {}),
                        cursor:
                          props?.manualPagination || props.disableSortBy
                            ? "default"
                            : "pointer",
                      }}
                    >
                      <>
                        {column.render("Header")}
                        {!props?.manualPagination && !props.disableSortBy && (
                          <>
                            &nbsp;
                            <SortIcon
                              sortDirection={
                                column.isSorted
                                  ? column.isSortedDesc
                                    ? "desc"
                                    : "asc"
                                  : false
                              }
                            />
                          </>
                        )}
                      </>
                    </HeaderCell>
                  )
                })}
              </TableRow>
            ))}
          </thead>
          {!isLoading && (
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row)
                return (
                  <TableRow
                    {...row.getRowProps()}
                    hoverEffect={!!onRowClick}
                    onClick={() => onRowClick && onRowClick(row)}
                    style={{
                      ...rowStyle,
                      cursor: onRowClick ? "pointer" : "unset",
                    }}
                  >
                    {row.cells.map((cell) => (
                      <Cell {...cell.getCellProps()} style={cellStyle}>
                        {cell.render("Cell")}
                      </Cell>
                    ))}
                  </TableRow>
                )
              })}
            </tbody>
          )}
        </TableWrapper>
        {isLoading && (
          <div style={{ padding: "120px 0", textAlign: "center" }}>
            Loading...
          </div>
        )}
        {!isLoading && data.length <= 0 && (
          <div style={{ padding: "120px 0", textAlign: "center" }}>
            No data found
          </div>
        )}
      </Wrapper>
      <Pagination>
        <button
          disabled={!canPreviousPage}
          onClick={() => previousPage()}
          style={{ fontSize: 0 }}
        >
          <img src={iconPrev} alt="Previous" style={{ height: 20 }} />
        </button>
        <span>
          Page {state?.pageIndex + 1} of {pageCount}
        </span>
        <button
          disabled={!canNextPage}
          onClick={() => nextPage()}
          style={{ fontSize: 0 }}
        >
          <img src={iconNext} alt="Next" style={{ height: 20 }} />
        </button>
      </Pagination>
    </div>
  )
}

export default Table
