import { GridIcon, ArrowBackIcon } from '@/components/icons'
import classNames from 'classnames'
import classes from './Header.module.scss'

export function Header() {
  return (
    <header className={classes.header}>
      <div className={classes.btns}>
        <button className={classes.btn}><GridIcon /></button>
        <button className={classes.btn}><ArrowBackIcon /></button>
        <button className={classNames(classes.btn, classes.active)}>Просмотр</button>
        <button className={classes.btn}>Управление</button>
      </div>
    </header>
  )
}
