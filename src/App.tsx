import { Header } from '@/components/Header/Header'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { ContentWithTable } from '@/components/ContentWithTable/ContentWithTable'
import classes from './App.module.scss'

function App() {
  return (
    <div className={classes.app}>
      <Header />
      <div className={classes.container}>
        <Sidebar />
        <main className={classes.main}>
          <div className={classes.titleBox}>
            <div className={classes.titleWrapper}>
              <h1 className={classes.title}>Строительно-монтажные работы</h1>
            </div>
          </div>
          <ContentWithTable />
        </main>
      </div>
    </div>
  )
}

export default App
