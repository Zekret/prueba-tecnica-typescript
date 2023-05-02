import { useEffect, useState } from 'react'
import './App.css'
import { UserList } from './components/UserList'
import { type User } from './types'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    setSortByCountry(prevState => !prevState)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const sortedUsers = sortByCountry
  // Si en este filtro se usa sort no funcionaria el boton dado que sort modifica el array y no lo vuelve al estado anterior por eso se usa toSorted o copiar el array con [...users] que muta un nuevo estado del array
    ? users.toSorted((a, b) => {
      return a.location.country.localeCompare(b.location.country) // localeCompare sirve para ayudar a comparar 2 strings tomando en cuenta acentos.
    })
    : users

  return (
    <div className="App">
      <h1>Prueba tecnica</h1>
      <header>
        <button onClick={toggleColors}>
          Colorear filas
        </button>
        <button onClick={toggleSortByCountry}>
          {sortByCountry ? 'No ordenar por pais' : 'Ordenar por pais'}
        </button>

      </header>
      <main>
      <UserList deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
      </main>
    </div>
  )
}

export default App
