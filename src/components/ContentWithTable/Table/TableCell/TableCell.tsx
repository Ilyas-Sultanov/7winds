import { ReactNode, KeyboardEvent, useRef, useEffect, ChangeEvent } from 'react'
import { flexRender, Cell } from '@tanstack/react-table'
import { TableRowData } from '../types'
import classes from './TableCell.module.scss'

type Props = {
  cell: Cell<TableRowData, unknown>
  status: 'default' | 'editing'
  onKeyDown: (
    e: KeyboardEvent<HTMLInputElement>,
    cell: Cell<TableRowData, unknown>,
  ) => void
  onChange: (
    dataKey: keyof TableRowData,
    value: string | number
  ) => void
}

export function TableCell({ cell, status, onKeyDown, onChange }: Props) {
  const inputRef = useRef<null | HTMLInputElement>(null)
  
  useEffect(() => {
    if (status === 'editing' && inputRef.current) {
      inputRef.current.value = String(cell.getValue())
    }
  }, [cell, status])

  const inputType = (() => {
    const value = cell.getValue()
    const valType = typeof value
    if (valType !== 'number' && valType !== 'string') {
      throw new Error('Не поддерживаемый тип значения в ячейке')
    }
    return valType
  })()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dataKey = cell.column.id as keyof TableRowData
    const newValue = inputType === 'number' ? Number(e.target.value) : e.target.value
    onChange(dataKey, newValue)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      onKeyDown(e, cell)
    }
  }

  let content: ReactNode = null
  if (status === 'editing') {
    content = (
      <td className={classes.editing}>
        <input
          ref={inputRef}
          className={classes.input}
          type={inputType}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      </td>
    ) 
  } else {
    content = (
      <td key={cell.id}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    )
  }

  return content
}
