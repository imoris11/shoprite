import React from 'react'
import ReactDOM from 'react-dom'
import './Resources/css/app.css'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'

const App = (props) => {
  return (
    <BrowserRouter>
      <Routes {...props} />
    </BrowserRouter>
  )
}
export default App;
