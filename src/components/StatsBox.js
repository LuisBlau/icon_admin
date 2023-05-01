import React from 'react'
import {
  CWidgetStatsA,
} from '@coreui/react'

const StatsBox = ({value, title, tokenName, color}) => {
  return (
    <CWidgetStatsA
      className="pb-4"
      color={color ? color: "primary"}
      value={
        <>
          {value}{' '}
          {tokenName && <span className="fs-6 fw-normal">
            ({tokenName})
          </span>}
        </>
      }
      title={title}
    />
  )
}

export default StatsBox
