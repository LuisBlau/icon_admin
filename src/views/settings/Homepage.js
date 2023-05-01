import React, { useEffect, useState, useContext, useCallback } from "react";
import { FormGroup, Label, Input } from 'reactstrap';
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CImage,
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

const Homepage = () => {
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
  const [activeKey, setActiveKey] = useState("SiteInfo")
  const [rate, setRate] = useState(null)
  const [owner, setOwner] = useState(null)
  const [name, setName] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const [decimals, setDecimals] = useState(null)
  const [totalSupply, setTotalSupply] = useState(null)
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

    
  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    (async () => {
      if (time % 5 === 0) {
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
          setTransactions(lists[9])
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
          <CNavLink href="#SiteInfo" active={activeKey === "SiteInfo"} onClick={() => setActiveKey("SiteInfo")}>
            Site Info
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#Header" active={activeKey === "Header"} onClick={() => setActiveKey("Header")}>
            Header
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#MainSection" active={activeKey === "MainSection"} onClick={() => setActiveKey("MainSection")}>
            Main Section
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#AboutICO" active={activeKey === "AboutICO"} onClick={() => setActiveKey("AboutICO")}>
            About ICO
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#CrowdSale" active={activeKey === "CrowdSale"} onClick={() => setActiveKey("CrowdSale")}>
            CrowdSale
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#HowItWorks" active={activeKey === "HowItWorks"} onClick={() => setActiveKey("HowItWorks")}>
            How It Works
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#RoadMap" active={activeKey === "RoadMap"} onClick={() => setActiveKey("RoadMap")}>
            RoadMap
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#WhitePaper" active={activeKey === "WhitePaper"} onClick={() => setActiveKey("WhitePaper")}>
            WhitePaper
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#Tokenomics" active={activeKey === "Tokenomics"} onClick={() => setActiveKey("Tokenomics")}>
            Tokenomics
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#FAQ" active={activeKey === "FAQ"} onClick={() => setActiveKey("FAQ")}>
            FAQ
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#Team" active={activeKey === "Team"} onClick={() => setActiveKey("Team")}>
            Team
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#Subscribe" active={activeKey === "Subscribe"} onClick={() => setActiveKey("Subscribe")}>
            Subscribe
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#ContactUs" active={activeKey === "ContactUs"} onClick={() => setActiveKey("ContactUs")}>
            ContactUs
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#Footer" active={activeKey === "Footer"} onClick={() => setActiveKey("Footer")}>
            Footer
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent>
        <br/><br/>
        <CTabPane visible={activeKey === "SiteInfo"}>
          <CContainer>
            <CRow>
              <CCol sm="auto">
              <CCard style={{ width: '18rem' }}>
                <CCardImage orientation="top" src="/images/react400.jpg" />
                <CCardBody>
                  <CCardTitle>Logo Image</CCardTitle>
                  <CCardText>
                    Please upload a site logo here.
                  </CCardText>
                  <CButton href="#" color="success" variant="outline">Upload</CButton>
                </CCardBody>
              </CCard>
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "MainSection"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="special_title">Section Heading:</Label>
                <Input type="text" name="special_title" id="special_title" placeholder="ex. Initial Coin Offering" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="main_title">Section Title:</Label>
                <Input type="text" name="main_title" id="main_title" placeholder="ex. Crypto ICO Project" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="main_description">Section Description:</Label>
                <Input type="textarea" name="main_description" id="main_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet dolorem blanditiis ad perferendis, labore delectus dolor sit amet, adipisicing elit." />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "AboutICO"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="about_ico_special_title" id="about_ico_special_title" placeholder="ex. About Crypto eComerce" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="about_ico_title" id="about_ico_title" placeholder="ex. Decenteralized Crypto eComerce" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="textarea" name="about_ico_description" id="about_ico_description" rows="8" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at dictum risus, non suscipit arcu. Quisque aliquam posuere tortor, sit amet convallis nunc scelerisque in. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit ipsa ut quasi adipisci voluptates, voluptatibus aliquid alias beatae reprehenderit incidunt iusto laboriosam." />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "CrowdSale"}>
          <CRow>
            <CCol sm="auto">
              <CButton size="lg">Save</CButton>
            </CCol>
          </CRow>
        </CTabPane>
        <CTabPane visible={activeKey === "HowItWorks"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="howitworks_special_title" id="howitworks_special_title" placeholder="ex. How To Start" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="howitworks_title" id="howitworks_title" placeholder="ex. How It Works" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="textarea" name="howitworks_description" id="howitworks_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo." />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "RoadMap"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="roadmap_special_title" id="roadmap_special_title" placeholder="ex. ICO Roadmap" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="roadmap_title" id="roadmap_title" placeholder="ex. Our ICO Roadmap" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="textarea" name="roadmap_description" id="roadmap_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo." />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "WhitePaper"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="whitepaper_special_title" id="whitepaper_special_title" placeholder="ex. Our ICO Whitepaper" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="whitepaper_title" id="whitepaper_title" placeholder="ex. Downoad Our Whitepaper" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="textarea" name="whitepaper_description" id="whitepaper_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore qui iste asperiores harum maiores praesentium facere ullam blanditiis, odio dolorum. Officia quisquam eaque suscipit facere ducimus, sit quaerat. Numquam, corrupti?" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "Tokenomics"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="tokenomics_special_title" id="tokenomics_special_title" placeholder="ex. About Our Token" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="tokenomics_title" id="tokenomics_title" placeholder="ex. Our Token Info" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="textarea" name="whitepaper_description" id="whitepaper_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo." />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "FAQ"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="faq_special_title" id="faq_special_title" placeholder="ex. Token FAQ" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="faq_title" id="faq_title" placeholder="ex. Frequently Questions" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="textarea" name="faq_description" id="faq_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo." />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "Team"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="team_special_title" id="team_special_title" placeholder="ex. Our Team" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="team_title" id="team_title" placeholder="ex. Awesome Team" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="textarea" name="team_description" id="team_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo." />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "Subscribe"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="subscribe_title" id="subscribe_title" placeholder="ex. Don’t Miss ICO News And Updates!" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="textarea" name="subscribe_description" id="subscribe_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo." />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "ContactUs"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="contactus_special_title" id="contactus_special_title" placeholder="ex. Contact us" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="text" name="contactus_title" id="contactus_title" placeholder="ex. Contact With Us" />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Input type="textarea" name="contactus_description" id="contactus_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo." />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg">Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
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

export default Homepage;