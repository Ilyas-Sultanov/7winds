import classNames from 'classnames'
import { ChevronIcon, MenuItemGridIcon } from '../icons'
import classes from './Sidebar.module.scss'

const menuItems: Array<string> = [
  'По проекту',
  'Объекты',
  'РД',
  'МТО',
  'СМР',
  'График',
  'МиМ',
  'Рабочие',
  'Капвложения',
  'Бюджет',
  'Финансирование',
  'Панорамы',
  'Камеры',
  'Поручения',
  'Контрагенты',
]

export function Sidebar() {
  return (
    <aside className={classes.sidebar}>
      <div className={classes.header}>
        <div className={classes.container}>
          <span className={classes.title}>Название проекта</span>
          <span className={classes.subtitle}>Аббревиатура</span>
        </div>
        <ChevronIcon />
      </div>
      <div className={classes.menu}>
        {
          menuItems.map((item) => {
            const cssClasses = classNames(classes.menuItem, {
              [classes.active]: item === menuItems[4]
            })
            return (
              <button key={item} className={cssClasses}>
                <MenuItemGridIcon className={classes.icon} />
                <span>{item}</span>
              </button>
            )
          })
        }
      </div>
    </aside>
  )
}
