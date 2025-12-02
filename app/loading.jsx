'use client'

import { Spinner } from "react-bootstrap"

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}
