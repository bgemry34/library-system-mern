const reservationRouter = require('express').Router()
const Reserve = require('../models/reserve')
const User = require('../models/user')
const Book = require('../models/book')

const userIsAdmin = (next, user) => {
  return (
    user.userType === 'admin' ||
    next(new Error('You are not allowed to approve a reservation request'))
  )
}

const validReserveStatus = (next, currentStatus, expectedStatus) => {
  return (
    currentStatus === expectedStatus ||
    next(new Error(`Reservation request has been ${currentStatus}`))
  )
}

// GET all reservation data
reservationRouter.get('/', async (req, res) => {
  const reserveList = await Reserve.find({}).populate('user', {
    name: 1,
    username: 1,
  })
  return res.json(reserveList)
})


module.exports = reservationRouter