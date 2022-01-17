import {Button, Form, Modal, Table} from 'react-bootstrap'
import {createRef, useState} from 'react'
import SimpleTooltip from './SimpleTooltip'
import * as AppConfig from '../config/app'
import {toast} from 'react-toastify'
import axios from 'axios'

export default function CreateGateway({
    show = false,
    title = 'Add Gateway',
    onHide = () => {},
    onCreated = () => {},
}) {
  const initialFormState = {
    serialNumber: '',
    name: '',
    IPv4: '',
    devices: []
  }
  const initialDeviceState = {
    uid: '',
    vendor: '',
    online: true
  }
  const ipValidPattern = '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$' // eslint-disable-line no-useless-escape
  const [sending, setSending] = useState(false)
  const [validated, setValidated] = useState(false)
  const [formData, setFormData] = useState(initialFormState)
  const formRef = createRef()

  const handleSubmit = () => {
    const form = formRef.current
    const isValid = form.checkValidity()
    setValidated(true)

    if (isValid) {
      const data = Object.assign({}, formData)
      data.devices = data.devices.map((device) => {
        const cloned = Object.assign({}, device)
        cloned['status'] = cloned.online ? 'online' : 'offline'
        delete cloned['online']

        return cloned
      })

      setSending(true)
      axios.post(AppConfig.baseUrl, data).then(({data: json}) => {
        setSending(false)
        if (!json.ok) {
          console.log(json.error)
          toast.error(json.error.message || 'Oops, sorry the operation was incorrect!')
          return
        }

        if (typeof onCreated === 'function') {
          onCreated()
        }

        handleClose()
      }).catch(error => {
        setSending(false)
        console.log(error)
        const response = error.response
        if (response.data && response.data.error && response.data.error.message) {
          toast.error(error.response.data.error.message)
          return
        }
        toast.error('Oops, sorry the operation was incorrect!')
      })
    }
  }

  const handleChange = (event) => {
    const name = event.target.name
    const index = event.target.getAttribute('data-index')
    const value = event.target.value

    if (index === null) {
      setFormData((prev) => Object.assign({}, prev, {
        [name]: value
      }))
      return
    }

    setFormData((prev) => {
      const devices = Object.assign([], prev.devices);
      devices[index][name] = event.target.type === 'checkbox' ? event.target.checked : value
      return Object.assign({}, prev, {devices})
    })
  }

  const handleClose = () => {
    setValidated(false)
    setFormData(initialFormState)
    if (typeof onHide === 'function') {
      onHide()
    }
  }

  const handleAddNewDevice = () => {
    if (formData.devices.length === AppConfig.maxDevices) {
      toast.error(`You have reached the limit of devices (${AppConfig.maxDevices}) that can be associated to one Gateway.`)
      return
    }

    setFormData((prev) => {
      const devices = prev.devices
      devices.push(initialDeviceState)
      return Object.assign({}, prev, {devices})
    })
  }

  const handleDeleteDevice = (index) => {
    setFormData((prev) => {
      const devices = prev.devices
      devices.splice(index, 1)
      return Object.assign({}, prev, {devices})
    })
  }

  const NoRowData = (
    <tr>
      <td colSpan={5} className="text-center">No Data</td>
    </tr>
  )

  const AllDataRow = () => {
    return formData.devices.map((device, index) => (
      <tr key={index}>
        <td><span className="mt-2">{index + 1}</span></td>
        <td>
          <Form.Group className="mb-3" controlId={'uidGroup-' + index}>
            <Form.Control required type="number" name="uid" disabled={sending} data-index={index}
                          value={formData.devices[index].uid} onChange={handleChange}/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
          </Form.Group>
        </td>
        <td>
          <Form.Group className="mb-3" controlId={'vendorGroup-' + index}>
            <Form.Control name="vendor" disabled={sending} data-index={index}
                          value={formData.devices[index].vendor} onChange={handleChange}/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </td>
        <td className="text-center">
          <Form.Group className="mb-3" controlId={'onlineGroup-' + index}>
            <Form.Check name="online" disabled={sending}
                        type="switch"
                        size="lg"
                        data-index={index}
                        checked={formData.devices[index].online} onChange={handleChange}/>
          </Form.Group>
        </td>
        <td className="text-center">
          <Button variant="danger" size="sm" onClick={() => handleDeleteDevice(index)}>Delete</Button>
        </td>
      </tr>
    ))
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate autoComplete="off" ref={formRef} validated={validated}>
          <Form.Group className="mb-3" controlId="snGroup">
            <Form.Label>Serial Number</Form.Label>
            <Form.Control required name="serialNumber" disabled={sending}
                          value={formData.serialNumber} onChange={handleChange}/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="nameGroup">
            <Form.Label>Name</Form.Label>
            <Form.Control required name="name" disabled={sending}
                          value={formData.name} onChange={handleChange}/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="ipGroup">
            <Form.Label>IPv4</Form.Label>
            <Form.Control required name="IPv4" disabled={sending}
                          value={formData.IPv4} onChange={handleChange}
                          pattern={ipValidPattern}/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {
                formData.IPv4 && formData.IPv4.length
                  ? 'This field has an invalid IP Address'
                  : 'This field is required'
              }
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Label>Devices</Form.Label>
          <SimpleTooltip text="Add a new Device" placement="top">
            <Button size="sm" variant="outline-success" className="float-end" onClick={handleAddNewDevice}>Add
              Device</Button>
          </SimpleTooltip>

          <Table striped>
            <thead>
            <tr>
              <th>#</th>
              <th>UID</th>
              <th>Vendor</th>
              <th className="text-center" style={{width: '5rem'}}>Online</th>
              <th className="text-center" style={{width: '7rem'}}>Action</th>
            </tr>
            </thead>
            <tbody>
            {formData.devices.length ? AllDataRow() : NoRowData}
            </tbody>
          </Table>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
