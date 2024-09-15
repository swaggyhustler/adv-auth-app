import {Route, Routes} from 'react-router-dom';
import PageNotFound from './components/PageNotFound';
import Login from './pages/Login';
const App = ()=>{
  return (
    <Routes>
      <Route path='*' element={<PageNotFound />}/>
      <Route path='/' element={<Login />} />
    </Routes>
  )
}

export default App;