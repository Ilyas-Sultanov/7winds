import { Table } from './Table/Table'
import classes from './ContentWithTable.module.scss'

export function ContentWithTable() {
  return (
    <div className={classes.contentWithTable}>
      <Table />
      <div id="tableLoader"></div>
    </div>
  )
}
