import { useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CForm,
  CCol,
  CFormInput,
  CButton
} from "@coreui/react";

const PermissionModal = ({visible, title, handleSubmit, hanldeClose}) => {
  const [address, setAddress] = useState("");

  return (
    <>
      <CModal visible={visible}>
        <CModalHeader>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={(e) => handleSubmit(e, address)} className="row g-3">
            <CCol xs="auto">
              <CFormInput feedback="Looks good!" required name="address" type="address" id="inputAddress" placeholder="Input correct value" onChange={e => setAddress(e.target.value)}/>
            </CCol>
            <CCol xs="auto">
              <CButton type="submit" className="mb-3">
                Confirm
              </CButton>
            </CCol>
            <CCol>
              <CButton type="button" onClick={hanldeClose} className="btn btn-secondary mb-3">
                Close
              </CButton>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default PermissionModal
