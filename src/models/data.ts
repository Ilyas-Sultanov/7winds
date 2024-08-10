export type TableRowData = {
  id: number
  rowName:	string
  total: number
  salary:	number
  mimExploitation:	number
  machineOperatorSalary:	number
  materials:	number
  mainCosts:	number
  supportCosts: number
  equipmentCosts:	number
  overheads:	number
  estimatedProfit:	number
  parentId:	number | null
  child: Array<TableRowData>
}

export type NewTableRowData = Omit<TableRowData, 'id' | 'total' | 'child'>
export type CreateResult = {
  current: Omit<TableRowData, 'parentId' | 'child'>,
  changed: Array<Omit<TableRowData, 'parentId' | 'child'>>
}

export type UpdatedTableRowData = Omit<TableRowData, 'id' | 'total' | 'child' | 'parentId'>
export type UpdateResult = {
  current: Omit<TableRowData, 'parentId' | 'child'>,
  changed: Array<Omit<TableRowData, 'parentId' | 'child'>>
}

export type DeletedResult = {
  current: null,
  changed: Array<Omit<TableRowData, 'parentId' | 'child'>>
}
