import {Button, Card, Col, Container, Row, Spinner, Table} from 'react-bootstrap'
import AppHeader from '../components/AppHeader'
import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Confirm from '../components/Confirm'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function GatewayDetail() {
  const [loading, setLoading] = useState(true)
  const [gatewayData, setGatewayData] = useState({})
  const {id} = useParams()

  const hideLoading = () => setLoading(false)

  const getDateFormatted = (date) => {
    const options = {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}
    return new Date(date).toLocaleDateString('en-US', options)
  }

  const fetchData = () => {
    axios.get('http://localhost:3001/api/gateways/' + id)
      .then(({data: json}) => {
        hideLoading()
        if (!json.ok) {
          console.log(json.error)
          toast.error('Oops, sorry the operation was incorrect!')
          return
        }

        setGatewayData(json.data)
      }).catch(error => {
      hideLoading()
      console.log(error)
      toast.error('Oops, sorry the operation was incorrect!')
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const DeviceRowsData = () => {
    return (gatewayData || {devices: []}).devices.map((device, index) => (
      <tr key={device.uid}>
        <td>{index + 1}</td>
        <td>{device.uid}</td>
        <td>{device.vendor}</td>
        <td>
          <span className={`text-capitalize ${device.status === 'online' ? 'text-success fw-bold' : 'text-secondary'}`}>
            {device.status}
          </span>
        </td>
        <td>{device.created ? getDateFormatted(device.created) : '-'}</td>
        <td>
          <Confirm
            onConfirm={() => handleConfirm(device.uid)}
            tooltip="Click here to remove this Device from the actual Gateway"
            modalText="Are you sure you want to delete this Device?"
            modalTitle={`Device: ${device.uid}`}>
            <Button variant="danger" size="sm">Delete</Button>
          </Confirm>
        </td>
      </tr>
    ))
  }

  const NoDataRow = (
    <tr>
      <td colSpan={6} className="text-center">
        No Data
      </td>
    </tr>
  )

  const handleConfirm = (deviceId) => {
    setLoading(true)
    axios.delete('http://localhost:3001/api/gateways/' + id + '/remove-device/' + deviceId)
      .then(({data: json}) => {
        hideLoading()
        if (!json.ok) {
          console.log(json.error)
          toast.error('Oops, sorry the operation was incorrect!')
          return
        }

        setGatewayData(json.data)
        toast.success('The Device was deleted successfully!')
      }).catch(error => {
        hideLoading()
        toast.error('Oops, sorry the operation was incorrect!')
        console.log(error)
    })
  }

  return (
    <>
      <AppHeader/>
      <Container>
        <Card className="mt-2">
          <Card.Body>
            <Card.Title>
              {loading && <Spinner animation="border" size="sm" variant="primary"/>}
              <span> Gateway</span> <span className="fw-normal">{id}</span>
              <Button size="sm" variant="outline-success" className="float-end" disabled={loading}>Add Device</Button>
              <Button href="/gateways" size="sm" variant="primary" className="float-end me-2">Go Back</Button>
            </Card.Title>
            <hr/>

            {!loading && <Row>
              <Col md={7}>
                <span className="fs-5 fw-bold me-2">Serial Number:</span>
                <span className="fs-5"> {gatewayData.serialNumber}</span>
              </Col>
              <Col>
                <span className="fs-5 fw-bold me-2">Name:</span>
                <span className="fs-5">{gatewayData.name}</span>
              </Col>
            </Row>}

            {!loading && <Row className="mt-2">
              <Col>
                <span className="fs-5 fw-bold me-2">IPv4 Address:</span>
                <span className="fs-5">{gatewayData.IPv4}</span>
              </Col>
            </Row>}

            {!loading && <fieldset className="mt-2">
              <legend className="fs-5 fw-bold">Devices:</legend>
              <Table striped>
                <thead>
                <tr>
                  <th>#</th>
                  <th>UID</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {loading || !gatewayData || !gatewayData.devices || !gatewayData.devices.length ? NoDataRow : DeviceRowsData()}
                </tbody>
              </Table>
            </fieldset>}
          </Card.Body>
        </Card>
      </Container>
      <ToastContainer />
    </>
  )
}