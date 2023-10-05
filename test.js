const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

const studentWithId1 = {
  id: 1,
  first_name: "Scotty",
  last_name: "Quigley",
  email: "Scotty79@hotmail.com",
  is_registered: 1,
  is_approved: 1,
  address: "241 Denesik Knolls Apt. 955",
  city: "Buffalo",
  state: "ME",
  zip: "04710",
  phone: "1-503-560-6954",
  created: "1628767983203.0",
  last_login: "1628770445749.0",
  ip_address: "2.137.18.155"
}

const greadeForStudent1 = [ 
{
  "course": "Calculus",
  "grade": 50
},
{
  "course": "Microeconomics",
  "grade": 43
},
{
  "course": "Statistics",
  "grade": 50
},
{
  "course": "Astronomy",
  "grade": 63
}
]

const allCourseSummary = {
  courseGradesReport: [
      {
          course: "Calculus",
          highestGrade: 100,
          lowestGrade: 0,
          averageGrade: 50.09270747689165
      },
      {
          course: "Microeconomics",
          highestGrade: 100,
          lowestGrade: 0,
          averageGrade: 49.81138092966023
      },
      {
          course: "Statistics",
          highestGrade: 100,
          lowestGrade: 0,
          averageGrade: 50.017376820961566
      },
      {
          course: "Astronomy",
          highestGrade: 100,
          lowestGrade: 0,
          averageGrade: 50.03889013536759
      },
      {
          course: "Philosophy",
          highestGrade: 100,
          lowestGrade: 0,
          averageGrade: 50.01606355689488
      }
  ]
}

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get student with invaled id' , async function(t) {
  const url = `${endpoint}/student/:id`
  try {
    const {response} = await jsonist.get(url)
    t.equal(response.statusCode , 400 , 'should return 400 status code')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get student with id not exist' , async function(t) {
  const url = `${endpoint}/student/amr`
  try {
    const {response} = await jsonist.get(url)
    t.equal(response.statusCode , 404 , 'should return 400 status code')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get student with id 1', async function(t) {
  const url = `${endpoint}/student/1`
  try {
    const {data , response} = await jsonist.get(url)
    t.equal(response.statusCode, 200, 'should have status code 200')
    t.equal(data.id , 1, 'should have id 1')
    t.deepEquals(data , studentWithId1 , 'should have same data for student with id 1')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get grades report for student with id 1' , async function(t) {
  const url = `${endpoint}/student/1/grades`
  try {
    const {data , response} = await jsonist.get(url)
    t.equal(response.statusCode , 200 , 'should return status code 200')
    t.deepEqual(data.student , studentWithId1 , 'shuold have sudent 1 data')
    t.deepEqual(
      data.grades,
      greadeForStudent1,
      'should have gradesForStudent1 data'
      )
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get grades report for student with not exist id', async function (t) {
  const url = `${endpoint}/student/9999999999/grades`
  try {
    const { response } = await jsonist.get(url)
    t.equal(response.statusCode, 404, 'should have status code 404')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('get grades report for courses', async function (t) {
  const url = `${endpoint}/course/all/grades`
  try {
    const { data, response } = await jsonist.get(url)
    t.equal(response.statusCode, 200, 'should have status code 200')
    t.deepEqual(data, allCourseSummary, 'should have same course summary data')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
