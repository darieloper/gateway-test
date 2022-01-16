import {Button, Col, Container, Form, FormControl, Row, Spinner, Table} from 'react-bootstrap'
import AppHeader from '../components/AppHeader'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
import SimpleTooltip from '../components/SimpleTooltip'

export default function GatewayList() {
  const [loading, setLoading] = useState(true)
  const [criteria, setCriteria] = useState('')
  const [gatewayData, setGatewayData] = useState([])

  const hideLoading = () => setLoading(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    axios.get('http://localhost:3001/api/gateways').then(({data}) => {
      hideLoading()
      if (!data.ok) {
        console.log(data.error)
        return
      }

      setGatewayData(data.data)
    }).catch((error) => {
      hideLoading()
      console.log(error)
    })
  }

  const updateCriteria = (event) => setCriteria(event.target.value)

  const getDetailUrl = (id) => '/gateways/' + id

  const getFilteredData = () => (gatewayData || []).filter((item) => {
    const searchCriteria = criteria.toLowerCase()
    const sn = (item.serialNumber || '').toLowerCase()
    const name = (item.name || '').toLowerCase()
    const ip = (item.IPv4 || '').toLowerCase()
    const devices = (item.devices || []).length.toString().toLowerCase()

    return sn.includes(searchCriteria) ||
      name.includes(searchCriteria) ||
      ip.includes(searchCriteria) ||
      devices.includes(searchCriteria)
  })

  const AllRows = () => {
    const dataSource = !!criteria.trim() ? getFilteredData() : (gatewayData || [])
    return !dataSource.length
      ? NoRowData
      : dataSource.map((item, index) => (
          <tr key={item._id}>
            <td>{index + 1}</td>
            <td>
              <SimpleTooltip text="Click to see details">
                <Link to={getDetailUrl(item._id)}>{item.serialNumber}</Link>
              </SimpleTooltip>
            </td>
            <td>{item.name}</td>
            <td>{item.IPv4}</td>
            <td className="text-center">{item.devices.length}</td>
            <td>
              <SimpleTooltip text="Click to see details">
                <Button href={getDetailUrl(item._id)} size="sm" variant="primary">Details</Button>
              </SimpleTooltip>
            </td>
          </tr>
        )
      )
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
  )

  const NoRowData = (
    <tr>
      <td colSpan={6}>
        <div className="text-center">
          <span>No Data</span>
        </div>
      </td>
    </tr>
  )

  return (
    <>
      <AppHeader/>
      <Container className="mt-3">
        <Form className="mb-2">
          <Row>
            <Col md={3}>
              <FormControl readOnly={loading}
                           type="search"
                           placeholder="Search"
                           value={criteria}
                           onChange={(event) => updateCriteria(event)}/>
            </Col>
            <Col>
              <Button variant="outline-success"
                      disabled={loading}
                      className="float-end">Add Gateway</Button>
            </Col>
          </Row>
        </Form>

        <Table striped responsive="sm">
          <thead>
          <tr>
            <th>#</th>
            <th>Serial Number</th>
            <th>Name</th>
            <th>IPv4</th>
            <th className="text-center">Devices</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {loading ? LoadingRow : AllRows()}
          </tbody>
        </Table>
      </Container>
    </>
  )
}