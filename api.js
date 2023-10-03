const knex = require('./db')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
 try {
  const {id} = req.params

  if(!id || id === ':id') return res.status(400).json({message : "Valid id is required"})

  const student = await knex('students').where({id}).first();

  if (!student) {
    return res.status(404).json({message : "student not found"})
  }

  res.status(200).json(student)
 } catch (error) {
  
 }
}

async function getStudentGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}

async function getCourseGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}
