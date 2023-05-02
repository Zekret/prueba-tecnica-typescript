import { useEffect, useState, useRef, useMemo } from 'react'
import './App.css'
import { UserList } from './components/UserList'
import { SortBy, type User } from './types.d'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([])
  // useRef esta pensado para guardar un valor que queremos que se comparta entre renderizados pero que al cambiar, no vuelva a renderizar el componente

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
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
    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }

    return filteredUsers.toSorted((a, b) => { // Si en este filtro se usa sort no funcionaria el boton dado que sort modifica el array y no lo vuelve al estado anterior por eso se usa toSorted o copiar el array con [...users] que muta un nuevo estado del array
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b)) // localeCompare sirve para ayudar a comparar 2 strings tomando en cuenta acentos.
    })
  }, [filteredUsers, sorting])

  return (
    <div className="App">
      <h1>Prueba tecnica</h1>
      <header>
        <button onClick={toggleColors}>
          Colorear filas
        </button>
        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY ? 'No ordenar por pais' : 'Ordenar por pais'}
        </button>
        <button onClick={handleReset}>
          Resetear estado
        </button>
        <input placeholder='Filtra por pais' onChange={(e) => { setFilterCountry(e.target.value) }} />
      </header>
      <main>
      <UserList changeSorting={handleChangeSort} deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
      </main>
    </div>
  )
}

export default App
