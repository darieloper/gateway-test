import 'bootstrap/dist/css/bootstrap.min.css'
import AppHeader from './components/AppHeader'
import {Alert, Container} from 'react-bootstrap'
import React from 'react'

function App() {
  return (
    <>
      <AppHeader />
      <Container fluid>
        <Alert variant="info" className="mt-2">
          Welcome, you can start visiting our <b>Gateway List</b> link!
        </Alert>
      </Container>
    </>
  )
}

export default App
