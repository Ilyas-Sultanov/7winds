import { CreateResult, NewTableRowData, TableRowData, DeletedResult, UpdateResult, UpdatedTableRowData } from '@/models/data'

const BASE_URL = 'http://185.244.172.108:8081'
const E_ID = '133819'

class DataService {
  async create(data: NewTableRowData) {
    const response = await fetch(
      `${BASE_URL}/v1/outlay-rows/entity/${E_ID}/row/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }
    )
    if (response.ok) {
      const data: Promise<CreateResult> = response.json()
      return data
    }
    throw new Error(`Что-то пошло не так, http статус ${response.status}`)
  }

  async getAll() {
    const response = await fetch(`${BASE_URL}/v1/outlay-rows/entity/${E_ID}/row/list`)
    if (response.ok) {
      const data: Promise<Array<TableRowData>> = response.json()
      return data
    }
    throw new Error(`Что-то пошло не так, http статус ${response.status}`)
  }

  async update(dataId: TableRowData['id'], data: UpdatedTableRowData) {
    const response = await fetch(
      `${BASE_URL}/v1/outlay-rows/entity/${E_ID}/row/${dataId}/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }
    )
    if (response.ok) {
      const data: Promise<UpdateResult> = response.json()
      return data
    }
    throw new Error(`Что-то пошло не так, http статус ${response.status}`)
  }

  async delete(dataId: TableRowData['id']) {
    const response = await fetch(
      `${BASE_URL}/v1/outlay-rows/entity/${E_ID}/row/${dataId}/delete`,
      {
        method: 'DELETE'
      }
    )
    if (response.ok) {
      const data: Promise<DeletedResult> = response.json()
      return data
    }
    throw new Error(`Что-то пошло не так, http статус ${response.status}`)
  }
}

export const dataService = new DataService()
