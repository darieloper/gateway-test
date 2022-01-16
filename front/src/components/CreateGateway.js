import {Button, Form, Modal} from 'react-bootstrap'
import {createRef, useState} from 'react'

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
  const ipValidPattern = "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
  const [sending, setSending] = useState(false)
  const [validated, setValidated] = useState(false)
  const [formData, setFormData] = useState(initialFormState)
  const formRef = createRef()

  const handleSubmit = () => {
    const form = formRef.current
    const isValid = form.checkValidity()
    setValidated(true)

    if (isValid) {
      console.log('OKOK')
    }
  }

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormData(Object.assign({}, formData, {
      [name]: value
    }))
  }

  const handleClose = () => {
    setValidated(false)
    setFormData(initialFormState)
    if (typeof onHide === 'function') {
      onHide()
    }
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
                  ? 'This field has a invalid IP Address'
                  : 'This field is required'
              }
            </Form.Control.Feedback>
          </Form.Group>
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