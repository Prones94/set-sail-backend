const request = require('supertest')
const express = require('express')

const app = express()
app.get('/', (req,res) => {
  res.status(200).send('Hello, Set Sail!')
})

describe('GET /', () => {
  it('should return a 200 status and the correct message', async () => {
   const res = await request(app).get('/')
   expect(res.statusCode).toEqual(200)
   expect(res.text).toBe('Hello, Set Sail!')
  })
})