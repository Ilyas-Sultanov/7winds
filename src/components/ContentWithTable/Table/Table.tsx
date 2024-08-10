import { ReactNode } from 'react'
import classNames from 'classnames'
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { type TableRowData } from '@/models/data'
import { TableRow } from './TableRow/TableRow'
import { useTableData } from './useTableData'
import { TableLoader } from './TableLoader/TableLoader'
import classes from './Table.module.scss'

const columns: ColumnDef<TableRowData>[] = [
  {
    header: 'Уровень',
  },
  {
    accessorKey: 'rowName',
    header: 'Наименование работ',
  },
  {
    accessorKey: 'salary',
    header: 'Основная з/п',
  },
  {
    accessorKey: 'equipmentCosts',
    header: 'Оборудование',
  },
  {
    accessorKey: 'overheads',
    header: 'Накладные расходы',
  },
  {
    accessorKey: 'estimatedProfit',
    header: 'Сметная прибыль',
  },
]

export function Table() {
  const {
    isLoading,
    tableData,
    error,
    addChildRow,
    deleteRow,
    saveNewRow,
    updateRow,
  } = useTableData()
  
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      expanded: true,
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.child,
  })

  let content: ReactNode = null

  if (error) {
    content = (
      <p className={classes.error}>{error}</p>
    )
  } else {
    const tableCssClasses = classNames(classes.table, {
      ['tableLoading']: isLoading
    })
    content = (
      <>
        <table className={tableCssClasses}>
          <colgroup>
            <col style={{width: '12%'}} />
            <col style={{width: 'auto'}} />
            <col style={{width: '12%'}} />
            <col style={{width: '12%'}} />
            <col style={{width: '12%'}} />
            <col style={{width: '12%'}} />
          </colgroup>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  row={row}
                  addChildRow={addChildRow}
                  saveNewRow={saveNewRow}
                  updateRow={updateRow}
                  deleteRow={deleteRow}
                />
              )
            })}
          </tbody>
        </table>
        {
          isLoading ? <TableLoader /> : null
        }
      </>
    )
  }

  return content
}
