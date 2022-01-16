import {useState} from 'react'
import React from 'react'
import {Button, Form, Modal} from 'react-bootstrap'

export default function CreateDevice(props) {
  const [validated, setValidated] = useState(false)
  const formRef = React.createRef()

  const handleClose = () => {
    setValidated(false)
    if (typeof props.onHide === 'function') {
      props.onHide()
    }
  }

  const handleSubmit = () => {
    const form = formRef.current
    const isValid = form.checkValidity()
    setValidated(true)

    if (isValid) {
      handleClose()
    }
  }

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit} ref={formRef}>
          <Form.Group className="mb-3" controlId="validationCustom01">
            <Form.Label>UID</Form.Label>
            <Form.Control required type="number"/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">This field is required.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Vendor</Form.Label>
            <Form.Control/>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasic">
            <Form.Label>Status</Form.Label> <br/>
            <Form.Check
              inline
              label="Online"
              name="group1"
              type="radio"
              defaultChecked
              id="radio-online"
            />
            <Form.Check
              inline
              label="Offline"
              name="group1"
              type="radio"
              id="radio-offline"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={handleClose}>
          Close
        </Button>
        <Button type="submit" variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}