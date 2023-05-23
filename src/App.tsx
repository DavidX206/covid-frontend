import { useState, useEffect, createContext } from 'react'
import './App.css'
import Diagnose from './pages/Diagnose/diagnose';
import { Search } from './pages/Search/search';
import SearchContext from '../context'

function App() {
  const [isSearch, setIsSearch] = useState(false)
  return (
    <SearchContext.Provider value={setIsSearch}>
      {isSearch ? <Search /> : <Diagnose />}
    </SearchContext.Provider>
  )
}
export default App
