import {Button, Modal} from 'react-bootstrap'
import React, {useState} from 'react'
import SimpleTooltip from './SimpleTooltip'

function Confirm(
  {
    modalTitle,
    modalText,
    tooltip,
    children,
    onConfirm,
    closeText = 'Cancel',
    okText = 'Confirm Delete',
    closeVariant = 'default',
    okVariant = 'danger',
    buttonText = 'Remove',
  }
) {
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  const handleOk = () => {
    setShow(false)
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
  }

  const handleClick = () => {
    setShow(true)
  }

  const modal = (<Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{modalTitle}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{modalText}</Modal.Body>
    <Modal.Footer>
      <Button variant={closeVariant} onClick={handleClose}>
        {closeText}
      </Button>
      <Button variant={okVariant} onClick={handleOk}>
        {okText}
      </Button>
    </Modal.Footer>
  </Modal>)

  let result
  if (children) {
    let button = React.Children.only(children)
    const clone = React.cloneElement(
      button,
      {
        onClick: handleClick
      },
      button.props.children,
    )
    result = (
      <>
        <SimpleTooltip text={tooltip}>
          {clone}
        </SimpleTooltip>
        {modal}
      </>
    )
  } else {
    result = (
      <>
        <SimpleTooltip text={tooltip}>
          <Button size="sm" variant="danger" onClick={handleClick}>{buttonText}</Button>
        </SimpleTooltip>
        {modal}
      </>
    )
  }

  return result
}

export default Confirm