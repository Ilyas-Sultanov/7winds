import { useEffect, useState, useCallback } from 'react'
import { DeletedResult, NewTableRowData, TableRowData, UpdatedTableRowData } from '@/models/data'
import { dataService } from './dataService'
import { excludeKeys } from '@/helpers/excludeKeys'

export function useTableData() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [tableData, setTableData] = useState<Array<TableRowData>>([])

  const getNewTableRowData = (parentId: TableRowData['parentId']) => {
    return {
      id: - Date.now(),
      rowName: '',
      total: 0,
      salary: 0,
      mimExploitation: 0,
      machineOperatorSalary: 0,
      materials: 0,
      mainCosts: 0,
      supportCosts: 0,
      equipmentCosts: 0,
      overheads: 0,
      estimatedProfit: 0,
      parentId: parentId,
      child: [],
    }
  }

  const handleError = (err: unknown) => {
    const errMsg = (err as Error).message
    console.error(errMsg)
    setError(errMsg)
  }

  const getData = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await dataService.getAll()
      if (data.length === 0) {
        data.push(getNewTableRowData(null))
      }
      setTableData(data)
    } catch(err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  const addChildRow = useCallback((dataId: TableRowData['id']) => {
    if (dataId < 0) {
      throw new Error('Попытка добавить потомка для не существующих данных')
    }
    setTableData((prevData) => {
      const newData = structuredClone(prevData)
      const newChild = getNewTableRowData(dataId)

      const addChild = (tData: Array<TableRowData>) => {
        tData.forEach((item) => {
          if (item.id === dataId) {
            item.child = [...item.child, newChild]
          } else if (item.child) {
            addChild(item.child)
          }
        })
      }

      addChild(newData)
      return newData
    })
  }, [])

  const deleteRow = useCallback(async (dataId: TableRowData['id']) => {
    try {
      setIsLoading(true)
      const isLastRow = tableData.length === 1 && tableData[0].id === dataId
      let result: DeletedResult | null = null
      if (dataId > 0) {
        result = await dataService.delete(dataId)
      }
      setTableData((prevData) => {
        const newData = [...prevData]
        const deleteRow = (tData: Array<TableRowData>) => {
          for (let i = 0; i < tData.length; i += 1) {
            if (tData[i].id === dataId) {
              tData.splice(i, 1)
            } else if (result) {
              for (let j = 0; j < result.changed.length; j += 1) {
                if (result.changed[j].id === tData[i].id) {
                  tData[i] = {...result.changed[j], parentId: tData[i].parentId, child: [...tData[i].child]}
                }
              }
            }
            if (tData[i] && tData[i].child) {
              deleteRow(tData[i].child) 
            }
          }
        }
        deleteRow(newData)
        return newData
      })
      if (isLastRow) {
        setTableData([getNewTableRowData(null)])
      }
    } catch(err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }, [tableData])

  const saveNewRow = useCallback(async (data: TableRowData) => {
    try {
      setIsLoading(true)
      const preparedData: NewTableRowData = excludeKeys(data, ['id', 'total', 'child'])
      const result = await dataService.create(preparedData)
      const newData = [...tableData]
      const changeRowData = (tData: Array<TableRowData>) => {
        for (let i = 0; i < tData.length; i += 1) {
          if (tData[i].id === data.id) {
            tData[i] = { ...result.current, parentId: data.parentId, child: [] }
          } else {
            for (let j = 0; j < result.changed.length; j += 1) {
              if (result.changed[j].id === tData[i].id) {
                tData[i] = {...result.changed[j], parentId: tData[i].parentId, child: [...tData[i].child]}
              }
            }
          }
          if (tData[i].child) {
            changeRowData(tData[i].child) 
          }
        }
      }
      changeRowData(newData)
      setTableData(newData)
    } catch(err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }, [tableData])

  const updateRow = useCallback(async (data: TableRowData) => {
    try {
      setIsLoading(true)
      const preparedData: UpdatedTableRowData = excludeKeys(data, ['id', 'total', 'child', 'parentId'])
      const result = await dataService.update(data.id, preparedData)
      const newData = [...tableData]
      const changeRowData = (tData: Array<TableRowData>) => {
        for (let i = 0; i < tData.length; i += 1) {
          if (tData[i].id === result.current.id) {
            tData[i] = { ...result.current, parentId: data.parentId, child: [...data.child] }
          } else {
            for (let j = 0; j < result.changed.length; j += 1) {
              if (result.changed[j].id === tData[i].id) {
                tData[i] = {...result.changed[j], parentId: tData[i].parentId, child: [...tData[i].child]}
              }
            }
          }
          if (tData[i].child) {
            changeRowData(tData[i].child) 
          }
        }
      }
      changeRowData(newData)
      setTableData(newData)
    } catch(err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }, [tableData])

  return {
    isLoading,
    error,
    tableData,
    setTableData,
    getNewTableRowData,
    addChildRow,
    deleteRow,
    saveNewRow,
    updateRow,
  }
}
