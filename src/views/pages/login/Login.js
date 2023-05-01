import { useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'

import { AuthContext } from 'src/context/AuthContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Login = () => {
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate(`/dashboard`)
  }, [isAuthenticated])

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <h1>Admin Panel</h1>
                  <p className="text-medium-emphasis">Please connect your wallet to sign in</p>
                  <ConnectButton />
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
