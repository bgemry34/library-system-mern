import React, { useEffect, useState } from 'react'
import { fetchDashBoardData } from '../../Api/Dashboard/Dashboard'
import { checkToken } from '../../Api/Users/Users'
import { useHistory } from 'react-router'
import { adminDashboard } from './AdminDashboard'
import { studentDashboard } from './StudentDashboard'

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalBooks: '---',
    totalBorrowedBooks: '---',
    totalStudents: '---',
  })
  const [recentAddedBooks, setRecentAddedBooks] = useState([])
  const [recentAddedStudents, setRecentAddedStudents] = useState([])
  const [recentBorrows, setRecentBorrows] = useState([])
  const [recentReservations, setRecentReservations] = useState([])

  const [forReturn, setForReturn] = useState([])
  const [pendingReservations, setPendingReservations] = useState([])

  const history = useHistory()
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    const fetchApi = async () => {
      const res = await checkToken()
      if (res === undefined) history.push('/')
      else if (res.status === 401) history.push('/')
      setUserType(res.data.userType)
      const data = await fetchDashBoardData()
      if (userType === 'admin') {
        setCounts(data.counts)
        setRecentAddedBooks(data.recentBooks)
        setRecentAddedStudents(data.recentStudents)
        setRecentBorrows(data.recentBorrows)
        setRecentReservations(data.recentReservations)
      } else {
        setCounts(data.counts)
        setForReturn(data.forReturn)
        setPendingReservations(data.pendingReservations)
      }
    }
    fetchApi()
  }, [history, userType])

  if (userType === 'admin') {
    return adminDashboard({
      counts,
      recentAddedBooks,
      recentAddedStudents,
      recentBorrows,
      recentReservations,
    })
  } else {
    return studentDashboard({
      counts,
      forReturn,
      pendingReservations,
    })
  }
}

export default Dashboard
