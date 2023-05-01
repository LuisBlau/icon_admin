import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer, cilHome
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Settings',
    to: '#',
    icon: <CIcon customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Homepage',
    to: '/homepage',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
]

export default _nav
