import React from 'react'
import {
  CRow,
  CCol,
} from '@coreui/react'
import StatsBox from "src/components/StatsBox"

const CustomWidgets = ({currentTokens, tokensSold, fundsRaised, fundsForwarded}) => {
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <StatsBox
          value={currentTokens}
          title="Token Balance"
          tokenName="SUMMER"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <StatsBox
          value={tokensSold}
          title="Token sold"
          tokenName="SUMMER"
          color="info"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <StatsBox
          value={fundsRaised}
          title="Raisd funds"
          tokenName="ETH"
          color="warning"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <StatsBox
          value={fundsForwarded}
          title="Forwarded funds"
          tokenName="ETH"
          color="danger"
        />
      </CCol>
    </CRow>
  )
}

export default CustomWidgets
