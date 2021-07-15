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
    let isCancelled = false

    const fetchApi = async () => {
      const res = await checkToken()
      if (res === undefined) history.push('/')
      else if (res.status === 401) history.push('/')
      const data = await fetchDashBoardData()
      if (!isCancelled) {
        if (userType === 'admin') {
          setUserType(res.data.userType)
          setCounts(data.counts)
          setRecentAddedBooks(data.recentBooks)
          setRecentAddedStudents(data.recentStudents)
          setRecentBorrows(data.recentBorrows)
          setRecentReservations(data.recentReservations)
        } else {
          setUserType(res.data.userType)
          setCounts(data.counts)
          setForReturn(data.forReturn)
          setPendingReservations(data.pendingReservations)
        }
      }
    }
    try {
      fetchApi()
    } catch (e) {
      console.log(e)
    }
    return () => (isCancelled = true)
  }, [history, userType])

  if (userType === 'admin') {
    return adminDashboard({
      counts,
      recentAddedBooks,
      recentAddedStudents,
      recentBorrows,
      recentReservations,
    })
  } else if (userType === 'student') {
    return studentDashboard({
      counts,
      forReturn,
      pendingReservations,
    })
  } else {
    return <div></div>
  }
}

export default Dashboard
