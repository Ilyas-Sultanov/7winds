import { createPortal } from 'react-dom'
import classes from './TableLoader.module.scss'

export function TableLoader() {
  const portalElement = document.getElementById('tableLoader') as HTMLDivElement
  return (
    <>
      {createPortal(
        <div className={classes.tableLoader}>
          <div className={classes.ldsRing}><div></div><div></div><div></div><div></div></div>
        </div>,
        portalElement,
      )}
    </>
  )
}
