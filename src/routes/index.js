const route = require('express').Router()

const userRoutes = require('./userRoutes')
const articleRoutes = require('./articleRoutes')
const commentRoutes = require('./commentRoutes')

route.use("/user", userRoutes)
route.use("/article", articleRoutes)
route.use("/comment", commentRoutes)

module.exports = route;