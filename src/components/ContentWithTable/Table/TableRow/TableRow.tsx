import { KeyboardEvent, ReactNode, useState, useEffect } from 'react'
import { Cell, Row } from '@tanstack/react-table'
import classNames from 'classnames'
import { TableRowData } from '@/models/data'
import { DocumentIcon, TrashIcon } from '@/components/icons'
import { TableCell } from '../TableCell/TableCell'
import classes from './TableRow.module.scss'

type Props = {
  row: Row<TableRowData>
  addChildRow: (dataId: TableRowData['id']) => void
  saveNewRow: (data: TableRowData) => Promise<void>
  updateRow: (data: TableRowData) => void
  deleteRow: (dataId: TableRowData['id']) => void
}

export function TableRow({ row, addChildRow, saveNewRow, updateRow, deleteRow }: Props) {
  const [editableData, setEditableData] = useState<TableRowData | null>(null)
  const isExistingData = row.original.id > 0

  useEffect(() => {
    if (!isExistingData) {
      setEditableData(row.original)
    }
  }, [setEditableData, row.original, isExistingData])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, cell: Cell<TableRowData, unknown>) => {
    if (!editableData) {
      return
    }
    if (e.key === 'Escape') {
      if (editableData.id < 0) {
        deleteRow(cell.row.original.id)
      }
      setEditableData(null)
    } else if (e.key === 'Enter') {
      if (editableData.id < 0) {
        saveNewRow(editableData)
      } else {
        updateRow(editableData)
      }
      setEditableData(null)
    }
  }

  const handleChange = (dataKey: keyof TableRowData, value: string | number) => {
    setEditableData((prev) => {
      if (prev) {
        const newData = {...prev}
        if (
          dataKey !== 'child' &&
          (typeof newData[dataKey] === 'string' || typeof newData[dataKey] === 'number')
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newData[dataKey] = value
          return newData
        }
      }
      return prev
    })
  }

  const onDelete = () => {
    if (editableData) {
      setEditableData(null)
    }
    deleteRow(row.original.id)
  }

  const parentRow = row.getParentRow()
  const childCount = row.subRows.length
  const hasSibling = parentRow && parentRow.subRows.length > 1
  const isNotLastSibling = parentRow && parentRow.subRows[parentRow.subRows.length - 1].id !== row.id
  const isNotLastSiblingHasChildAndNextSibling = childCount > 0 && hasSibling && isNotLastSibling

  const cssClasses = classNames(classes.row, {
    [classes.hasParentRow]: parentRow,
    [classes.hasChildAndNextSibling]: isNotLastSiblingHasChildAndNextSibling,
  })

  return (
    <tr
      style={{ '--level': row.depth, '--child-count': childCount } as React.CSSProperties}
      className={cssClasses}
      onDoubleClick={() => setEditableData(row.original)}
    >
      {row.getVisibleCells().map((cell, index) => {
        let content: ReactNode = null
        if (index === 0) {
          content = (
            <td key={cell.id}>
              <div className={classes.rowBtns}>
                <button
                  className={classes.btn}
                  disabled={Boolean(editableData)}
                  onClick={() => addChildRow(row.original.id)}
                >
                  <DocumentIcon />
                </button>
                <button
                  className={classNames(classes.btn, classes.deleteBtn)}
                  onClick={onDelete}
                >
                  <TrashIcon />
                </button>
              </div>
            </td>
          )
        } else {
          content = (
            <TableCell
              key={cell.id} 
              cell={cell} 
              status={editableData ? 'editing' : 'default'}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
            />
          )
        }
        return content
      })}
    </tr>
  )
}
