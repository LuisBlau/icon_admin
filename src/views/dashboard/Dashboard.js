import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CTabContent,
  CTabPane,
  CNav,
  CNavLink,
  CNavItem,
  CWidgetStatsF,
} from "@coreui/react";
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilChartPie,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { useTimer } from 'use-timer';
import Swal from "sweetalert2";
import StatsBox from "src/components/StatsBox";
import { AuthContext } from 'src/context/AuthContext';
import CustomWidgets from "../widgets/CustomWidget";
import PermissionModal from "src/components/PermissionModal";
import MintModal from "src/components/MintModal";
import {
  getRate,
  getHistory,
  getTokensSold,
  getRaisdFunds,
  getTotalSupply,
  getMaxTokenNumber,
  getMintingStatus,
  getCurrentTokens,
  getForwardability,
  getForwardedFunds,
  getCrowdSaleStatus,
  getStaticTokenInfo,
  mint,
  pause,
  unPause,
  setTokenRate,
  forwardFunds,
  forwardTokens,
  terminateCrowdSale,
  startCrowdSale,
  setAdminPermission,
  removeAdminPermission,
} from '../../utils/helper'

const Dashboard = () => {
  const { time, start } = useTimer();
  const [crowdSaleStatus, setCrowdSaleStatus] = useState(null);
  const [transactions, setTransactions] = useState(null)
  const [tokensSold, setTokensSold] = useState(0)
  const [currentTokens, setCurrentTokens] = useState(0)
  const [fundsRaised, setFundsRaised] = useState(0)
  const [fundsForwarded, setFundsForwarded] = useState(0)
  const [isForwardable, setForwardble] = useState(false)
  const [visible, setVisible] = useState(false)
  const [mintVisible, setMintVisible] = useState(false)
  const [mTitle, setTitle] = useState('')
  const [activeKey, setActiveKey] = useState("CrowdSale")
  const [rate, setRate] = useState(null)
  const [owner, setOwner] = useState(null)
  const [name, setName] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [decimals, setDecimals] = useState(null)
  const [totalSupply, setTotalSupply] = useState(null)
  const [maxTokenNumber, setMaxTokenNumber] = useState(null)
  const [paused, setPause] = useState(null)
  const { isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    window.location = "/admin"
  }

  const handleMint = useCallback(async (e, {address, num}) => {
    e.preventDefault()
    e.stopPropagation()
    const {success, message} = await mint(address, num)

    if (success) {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message,
      });
    } else {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "error",
        title: message,
      });
    }
  })

  const handleSubmit = useCallback(async (e, val) => {
    e.preventDefault()
    e.stopPropagation()
    let res
    switch(mTitle) {
      case "Set an admin":
        res = await setAdminPermission(val)
        if (res.success) {
          Swal.fire({
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            icon: "success",
            title: res.message,
          });
        } else {
          Swal.fire({
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            icon: "error",
            title: res.message,
          });
        }
        break
      case "Remove an admin":
        res = await removeAdminPermission(val)
        if (res.success) {
          Swal.fire({
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            icon: "success",
            title: res.message,
          });
        } else {
          Swal.fire({
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            icon: "error",
            title: res.message,
          });
        }
        break
      case "Set rate":
        res = await setTokenRate(val)
        if (res.success) {
          Swal.fire({
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            icon: "success",
            title: res.message
          });
        } else {
          Swal.fire({
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            icon: "error",
            title: res.message,
          });
        }
        break
    }
    setVisible(false)
  }, [mTitle])

  const handleStart = useCallback(async () => {
    if (crowdSaleStatus) return
    const {success, message} = await startCrowdSale();
    if (success) {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message,
      });
    } else {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "error",
        title: message,
      });
    }
  }, [crowdSaleStatus])

  const handleTerminate = useCallback(async () => {
    if (!crowdSaleStatus) return
    const {success, message} = await terminateCrowdSale();
    if (success) {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message
      });
    } else {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "error",
        title: message
      });
    }
  }, [crowdSaleStatus])

  const handleCollectFunds = useCallback(async () => {
    const {success, message} = await forwardFunds();
    if (success) {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message,
      });
    } else {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message,
      });
    }
  }, [])

  const handleCollectTokens = useCallback(async () => {
    if (crowdSaleStatus) return
    const {success, message} = await forwardTokens();
    if (success) {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message,
      });
    } else {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "error",
        title: message,
      });
    }
  }, [crowdSaleStatus])

  const handlePause = useCallback(async () => {
    if (paused) return
    const {success, message} = await pause()
    if (success) {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message,
      });
    } else {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message,
      });
    }
  }, [paused])

  const handleUnpause = useCallback(async () => {
    if (!paused) return
    const {success, message} = await unPause()
    if (success) {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message,
      });
    } else {
      Swal.fire({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        icon: "success",
        title: message,
      });
    }
  }, [paused])
    
  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    (async () => {
      if (time % 30 === 0) {
        const allPromise = Promise.all([
          getCurrentTokens(),
          getTokensSold(),
          getRaisdFunds(),
          getForwardedFunds(),
          getForwardability(),
          getRate(),
          getCrowdSaleStatus(),
          getMintingStatus(),
          getTotalSupply(),
          getMaxTokenNumber(),
          getHistory(),
        ])
        try {
          const lists = await allPromise
          setCurrentTokens(lists[0])
          setTokensSold(lists[1])
          setFundsRaised(lists[2])
          setFundsForwarded(lists[3])
          setForwardble(lists[4])
          setRate(lists[5])
          setCrowdSaleStatus(lists[6])
          setPause(lists[7])
          setTotalSupply(lists[8])
          setMaxTokenNumber(lists[9])
          setTransactions(lists[10])
        } catch(e) {
          console.log(e)
        }
      }
    })()
  }, [time])

  useEffect(() => {
    getStaticTokenInfo()
    .then(res => {
      setName(res.name)
      setSymbol(res.symbol)
      setDecimals(res.decimals)
      setOwner(res.owner)
    })
  }, [])

  return (
    <div>
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink href="#CrowdSale" active={activeKey === "CrowdSale"} onClick={() => setActiveKey("CrowdSale")}>
            CrowdSale
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#Tokens" active={activeKey === "Tokens"} onClick={() => setActiveKey("Tokens")}>
            Tokens
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#Transactions" active={activeKey === "Transactions"} onClick={() => setActiveKey("Transactions")}>
            Transactions
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent>
        <br/><br/>
        <CTabPane visible={activeKey === "CrowdSale"}>
          <CRow>
            <CCol xs={3}>
              <StatsBox
                value={rate}
                title="Current rate"
                color="secondary"  
              />
            </CCol>
            <CCol xs={2}/>
            <CCol xs={4}>
              {crowdSaleStatus!==null ? 
                <div>
                  {crowdSaleStatus?
                    <h4>CROWDSALE IS ACTIVE.</h4>
                    :
                    <h4>CROWDSALE IS NOT ACTIVE.</h4>}
                </div> :
                <h4>Checking CrowdSale Status...</h4>
              }
            </CCol>
          </CRow>
          <br/>
          <CustomWidgets
            currentTokens={currentTokens}
            tokensSold={tokensSold}
            fundsRaised={fundsRaised}
            fundsForwarded={fundsForwarded}
          />
          <br/><br/>
          <CRow>
            <CCol xs>
              <CButtonGroup role="group" aria-label="actions">
                <CButton color="info" disabled={crowdSaleStatus ? true: false} className="" onClick={() => handleStart()}>
                  START CrowdSale
                </CButton>
                <CButton
                  color="danger"
                  className=""
                  disabled={!crowdSaleStatus ? true: false}
                  onClick={() => handleTerminate()}
                >
                  STOP CrowdSale
                </CButton>
                <CButton
                  color="success"
                  className=""
                  disabled={!isForwardable ? true: false}
                  onClick={() => handleCollectFunds()}
                >
                  Collect Funds
                </CButton>
                <CButton
                  color="warning"
                  className=""
                  disabled={crowdSaleStatus ? true: false}
                  onClick={() => handleCollectTokens()}
                >
                  Collect Tokens
                </CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol xs>
              <CButtonGroup role="group" aria-label="permission">
                <CButton color="info" onClick={() => {setVisible(true); setTitle("Set an admin");}}>
                  Set an admin
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => {setVisible(true); setTitle("Remove an admin");}}
                >
                  Remove an admin
                </CButton>
              </CButtonGroup>
            </CCol>
            <CCol xs>
              <CButton color="primary" onClick={() => {setVisible(true); setTitle("Set rate");}}>
                Set rate
              </CButton>
            </CCol>
          </CRow>
        </CTabPane>
        <CTabPane visible={activeKey === "Tokens"}>
          <CRow>
            <CCol xs={4}>
              <CWidgetStatsF
                className="mb-3"
                color="warning"
                icon={<CIcon icon={cilBell} height={24} />}
                title="Current Token Minting Status"
                value={
                  paused === null ?
                    "Checking CrowdSaleToken status... ":
                    <div>
                      {
                        paused ? "Paused" : "Active"
                      }
                    </div>
                }
              />
            </CCol>
            <CCol xs={4}/>
            <CCol xsj={2}>
              <CButton color="primary" disabled={paused ? true : false} onClick={() => {setMintVisible(true); setTitle("Mint tokens");}}>
                Mint Tokens
              </CButton>
            </CCol>
            <CCol xsj={2}>
              <CButtonGroup role="group" aria-label="permission">
                <CButton color="info" disabled={paused ? true : false} onClick={()=> handlePause()}>
                  Pause
                </CButton>
                <CButton
                  color="danger"
                  disabled={!paused ? true : false}
                  onClick={() => handleUnpause()}
                >
                  Unpause
                </CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={3}>
              <CWidgetStatsF
                className="mb-3"
                color="primary"
                icon={<CIcon icon={cilChartPie} height={24} />}
                title="Name"
                value={name}/>
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsF
                className="mb-3"
                color="success"
                icon={<CIcon icon={cilChartPie} height={24} />}
                title="Symbol"
                value={symbol}/>
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsF
                className="mb-3"
                color="info"
                icon={<CIcon icon={cilSpeedometer} height={24} />}
                title="Decimals"
                value={decimals}/>
            </CCol>
            <CCol xs={3}>
              <CWidgetStatsF
                className="mb-3"
                color="warning"
                icon={<CIcon icon={cilUser} height={24} />}
                title="Owner"
                value={owner && `${owner.slice(0, 7)} ... ${owner.slice(35, owner.length)}`}/>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs>
              <StatsBox
                value={totalSupply}
                title="Total Supply"
                tokenName="SUMMER"
                color="success"
              />
            </CCol>
            <CCol xs>  
              <StatsBox
                value={maxTokenNumber}
                title="Maxmum Number of Tokens"
                tokenName="SUMMER"
                color="success"
              />
            </CCol>
          </CRow>
          <br/>
        </CTabPane>
        <CTabPane visible={activeKey === "Transactions"}>
          {crowdSaleStatus !== null ?
            <CRow>
              <CCol xs>
                <CCard className="mb-4">
                  <CCardHeader>Transaction History</CCardHeader>
                  <CCardBody>
                    <CTable align="middle" className="mb-0 border" hover responsive>
                      <CTableHead color="light">
                        <CTableRow>
                          <CTableHeaderCell>
                            Tnx hash
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            Block
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            Age
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            From
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            To
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            Value
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            [Txn Fee]
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {transactions && transactions.map((transaction, index) => (
                          <CTableRow v-for="item in tableItems" key={index}>
                            <CTableDataCell>
                              {transaction.hash.slice(0, 20)}...
                            </CTableDataCell>
                            <CTableDataCell>
                              {transaction.blockNumber}
                            </CTableDataCell>
                            <CTableDataCell>
                              {transaction.timestamp}
                            </CTableDataCell>
                            <CTableDataCell>
                              {transaction.from.slice(0, 20)}...
                            </CTableDataCell>
                            <CTableDataCell>
                              {transaction.to?.slice(0, 20)}...
                            </CTableDataCell>
                            <CTableDataCell>
                              {transaction.value.toString() / 10**18} ETH
                            </CTableDataCell>
                            <CTableDataCell>
                              {transaction.gasPrice.toString()}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow> :
            <CRow className="pt-5 justify-content-center">
              <CSpinner />
            </CRow>
          }
        </CTabPane>
      </CTabContent>
      <PermissionModal
        visible={visible}
        title={mTitle}
        handleSubmit={handleSubmit}
        hanldeClose={() => setVisible(false)}
      />
      <MintModal
        visible={mintVisible}
        handleSubmit={handleMint}
        hanldeClose={() => setMintVisible(false)}
      />
    </div>
  );
};

export default Dashboard;
