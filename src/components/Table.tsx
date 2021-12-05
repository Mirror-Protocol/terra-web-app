import React, { useEffect } from "react"
import styled from "styled-components"
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  Column,
  Row,
  usePagination,
} from "react-table"

import iconNext from "images/icon-next.svg"
import iconPrev from "images/icon-prev.svg"
// import iconUp from "images/icon-arrow-head-up.svg";
// import iconDown from "images/icon-arrow-head-down.svg";

type TableProps<T extends object> = {
  data?: T[]
  columns: Column<T>[]
  searchKeyword?: string
  onRowClick?(row: Row<T>): void
  isLoading?: boolean
}

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  overflow-x: auto;
`

const TableWrapper = styled.table`
  border-top: 1px solid #e8e8e8;
  margin-bottom: 14px;
  position: relative;
  width: 100%;
  height: auto;
  table-layout: auto;
`

const TableRow = styled.tr`
  width: 100%;
  height: auto;
  border-bottom: 1px solid #e8e8e8;

  transition: all 0.125s ease-in-out;
  &:hover {
    background-color: #0222ba11;
  }
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
`

const HeaderCell = styled(Cell)`
  font-weight: 700;
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

const Table = <T extends object>({
  columns,
  data = [],
  searchKeyword,
  onRowClick,
  isLoading,
}: TableProps<T>) => {
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
    { columns, data, initialState: { pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  useEffect(() => {
    setGlobalFilter(searchKeyword)
  }, [searchKeyword, setGlobalFilter])
  return (
    <div>
      <Wrapper>
        <TableWrapper {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <HeaderCell
                      {...column.getHeaderProps()}
                      colSpan={undefined}
                    >
                      {column.render("Header")}
                    </HeaderCell>
                  )
                })}
              </TableRow>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <TableRow
                  {...row.getRowProps()}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? "pointer" : "unset" }}
                >
                  {row.cells.map((cell) => (
                    <Cell {...cell.getCellProps()}>{cell.render("Cell")}</Cell>
                  ))}
                </TableRow>
              )
            })}
          </tbody>
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
