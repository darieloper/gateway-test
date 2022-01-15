import {Badge, Button, Container, Spinner, Table} from 'react-bootstrap'
import AppHeader from '../components/AppHeader'
import {useEffect, useState} from 'react'
import axios from 'axios'

export default function GatewayList () {
  const [loading, setLoading] = useState(true)
  const [gatewayData, setGatewayData] = useState([])

  const hideLoading = () => setLoading(false)

  useEffect(() => {
    fetchData()
  })

  const fetchData = () => {
    axios.get('http://localhost:3001/api/gateways').then(json => {
      hideLoading()
      if (!json.data.ok) {
        console.log(json.data.error);
        return;
      }

      setGatewayData(json.data)
    }).catch((error) => {
      hideLoading()
      console.log(error)
    })
  }

  const LoadingRow = (
    <tr>
      <td colSpan={6}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="sm"/>
          <span> Loading</span>
        </div>
      </td>
    </tr>
  );

  const DefaultRows = (
    <tr></tr>
  );

  return (
    <div>
      <AppHeader />
      <Container className="mt-3">
        <Button variant="outline-success" className="float-end mb-2">Add Gateway</Button>
        <Table striped responsive="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Serial Number</th>
              <th>Name</th>
              <th>Status</th>
              <th>Devices</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? LoadingRow : DefaultRows}
          </tbody>
        </Table>
      </Container>
    </div>
  )
}