import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Navbar from '../navbar/navbar'

function Homepage() {
  return (
    <div>
        <Navbar />
        <Container className="mt-5">
        <h1>Welcome Fellow Coders</h1>
      </Container>
    </div>
  )
}

export default Homepage