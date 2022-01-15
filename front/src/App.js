import 'bootstrap/dist/css/bootstrap.min.css'
import AppHeader from './components/AppHeader'
import {Alert, Card, Container} from 'react-bootstrap'

function App() {
  return (
    <div>
      <AppHeader />
      <Container fluid>
        <Alert variant="info" className="mt-2">
          Welcome, you can start visiting our <b>Gateway List</b> link!
        </Alert>
      </Container>
    </div>
  )
}

export default App
