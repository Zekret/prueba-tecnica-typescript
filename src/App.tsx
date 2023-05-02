import { useEffect, useState, useRef, useMemo } from 'react'
import './App.css'
import { UserList } from './components/UserList'
import { type User } from './types'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([])
  // useRef esta pensado para guardar un valor que queremos que se comparta entre renderizados pero que al cambiar, no vuelva a renderizar el componente

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    setSortByCountry(prevState => !prevState)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
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
        originalUsers.current = res.results
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  // Siempre se recomienda primero filtrar los usuarios y luego ordenarlos.
  // Para evitar calcular los filtros y ordenar se guardan en memoria usando useMemo y que solo se realice cuando sus dependencias se necesiten.

  const filteredUsers = useMemo(() => {
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter(user => {
        return user.location.country.toLowerCase().includes(filterCountry.toLocaleLowerCase())
      })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    return sortByCountry
    // Si en este filtro se usa sort no funcionaria el boton dado que sort modifica el array y no lo vuelve al estado anterior por eso se usa toSorted o copiar el array con [...users] que muta un nuevo estado del array
      ? filteredUsers.toSorted((a, b) => {
        return a.location.country.localeCompare(b.location.country) // localeCompare sirve para ayudar a comparar 2 strings tomando en cuenta acentos.
      })
      : filteredUsers
  }, [filteredUsers, sortByCountry])

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
        <button onClick={handleReset}>
          Resetear estado
        </button>
        <input placeholder='Filtra por pais' onChange={(e) => { setFilterCountry(e.target.value) }} />
      </header>
      <main>
      <UserList deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
      </main>
    </div>
  )
}

export default App
