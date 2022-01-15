import {OverlayTrigger, Tooltip} from 'react-bootstrap'

export default function SimpleTooltip (props) {
  return (
    <OverlayTrigger placement={props.placement || 'bottom'} overlay={
      <Tooltip id={'tooltip-' + Math.floor(Math.random() * 1000)}>
        {props.text || 'Simple tooltip text'}
      </Tooltip>
    }>
      {props.children}
    </OverlayTrigger>
  )
}