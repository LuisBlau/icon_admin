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

const MintModal = ({visible, title, handleSubmit, hanldeClose}) => {
  const [address, setAddress] = useState("");
  const [num, setNum] = useState(0)

  return (
    <>
      <CModal visible={visible}>
        <CModalHeader>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={(e) => handleSubmit(e, {address, num})} className="row g-3">
            <CCol xs="auto">
              <CFormInput feedback="Looks good!" required name="address" id="inputAddress" placeholder="Input correct value" onChange={e => setAddress(e.target.value)}/>
            </CCol>
            <CCol xs="auto">
              <CFormInput feedback="Looks good!" required name="num" id="num" placeholder="Input correct num" onChange={e => setNum(e.target.value)}/>
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

export default MintModal
