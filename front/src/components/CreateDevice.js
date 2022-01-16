import {useState, createRef} from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import axios from 'axios'
import {toast} from 'react-toastify'

export default function CreateDevice({
  show = false,
  onHide = () => {},
  onCreated = () => {},
  gatewayId
}) {
  const initialFormState = {
    uid: '',
    vendor: '',
    status: 'online'
  }
  const [sending, setSending] = useState(false)
  const [validated, setValidated] = useState(false)
  const [formData, setFormData] = useState(initialFormState)
  const formRef = createRef()

  const handleClose = () => {
    setValidated(false)
    setFormData(initialFormState)
    if (typeof onHide === 'function') {
      onHide()
    }
  }

  const handleChangeValue = (event) => {
    const value = event.target.value
    const name = event.target.name
    setFormData(Object.assign({}, formData, {
      [name]: value
    }))
  }

  const handleSubmit = () => {
    const form = formRef.current
    const isValid = form.checkValidity()
    setValidated(true)

    if (isValid) {
      setSending(true)
      axios.post('http://localhost:3001/api/gateways/' + gatewayId + '/add-device', formData)
        .then(({data: json}) => {
          setSending(false)
          if (!json.ok) {
            console.log(json.error)
            toast.error('Oops, sorry the operation was incorrect!')
            return
          }

          if (typeof onCreated === 'function') {
            onCreated()
          }
          handleClose()
        }).catch(error => {
          setSending(false)
          toast.error('Oops, sorry the operation was incorrect!')
          console.log(error)
      })
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit} ref={formRef} autoComplete="off">
          <Form.Group className="mb-3" controlId="uidGroup">
            <Form.Label>UID</Form.Label>
            <Form.Control required type="number" name="uid" disabled={sending}
                          value={formData.uid} onChange={handleChangeValue}/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">This field is required.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="vendorGroup">
            <Form.Label>Vendor</Form.Label>
            <Form.Control value={formData.vendor} name="vendor"
                          onChange={handleChangeValue} disabled={sending}/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="statusGroup">
            <Form.Label>Status</Form.Label> <br/>
            <Form.Check
              inline
              label="Online"
              name="status"
              type="radio"
              defaultChecked
              id="radio-online"
              value="online"
              disabled={sending}
              onChange={handleChangeValue}
            />
            <Form.Check
              inline
              label="Offline"
              name="status"
              type="radio"
              id="radio-offline"
              value="offline"
              disabled={sending}
              onChange={handleChangeValue}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={handleClose}>
          Close
        </Button>
        <Button type="submit" variant="primary" onClick={handleSubmit} disabled={sending}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}