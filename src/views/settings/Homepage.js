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
  CFormTextarea,
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
  CFormInput,
  CFormSwitch,
  CModal,
  CModalBody,
  CModalHeader,
  CModalFooter,
  CModalTitle,
  CInputGroup
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
} from '../../utils/helper';
import {
  uploadFile,
  getSetting,
  API_URL,
  saveSetting,
  getHowBlocks,
  deleteHowBlock,
  addHowBlock,
  updateHowBlock,
  getContactBlocks,
  deleteContactBlock,
  addContactBlock,
  updateContactBlock
} from "src/api/api";

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
  const [logoImageFileName, setLogoImageFileName] = useState('Not selected');
  const [logoImageURL, setLogoImageURL] = useState('/images/react400.jpg');
  const [setting, setSetting] = useState({how: {}, about: {}, faq: {}, roadmap: {}, tokenomics: {}, whitepaper: {}, team: {}, subscribe: {}, contact: {}, main: {}});

  /*  For How Section */
  const [howModalVisible, setHowModalVisible] = useState(false);
  const [howBlocks, setHowBlocks] = useState([]);
  const [selectedHowBlock, setSelectedHowBlock] = useState({_id: null, title: '', text: '', num: '', img: null});
  const [howBlockImgFileName, setHowBlockImgFileName] = useState('Not selected');
  const [howBlockImgURL, setHowBlockImgURL] = useState('/images/react400.jpg');

  useEffect(() => {
    if (!howModalVisible) {
      setSelectedHowBlock({_id: null, title: '', text: '', num: '', img: null});
      setHowBlockImgURL(null);
      setHowBlockImgFileName('Not selected');
    }
  }, [howModalVisible]);

  const handleHowBlockSaveBtn = async () => {
    if (!selectedHowBlock.num || !selectedHowBlock.title || !selectedHowBlock.text || (howBlockImgFileName === "Not selected" && !selectedHowBlock.img)) {
      return;
    }
    let imageURL = selectedHowBlock.img;
    if (howBlockImgFileName !== "Not selected") {
      let imagefile = document.getElementById('howBlockImg');
      if (imagefile.files.length > 0) {
        imageURL = await uploadFile(imagefile.files[0]);
        setHowBlockImgURL(`${API_URL}${imageURL}`);
        imageURL = `${API_URL}${imageURL}`;
      }
    }
    if (selectedHowBlock._id) {
      await updateHowBlock({...selectedHowBlock, img: imageURL});
    } else {
      await addHowBlock({...selectedHowBlock, img: imageURL});
    }
    let res2 = await getHowBlocks();
    setHowBlocks(res2);
    setHowModalVisible(false);
  }

  const handleHowBlockDelBtn = async (id) => {
    let res1 = await deleteHowBlock(id);
    let res2 = await getHowBlocks();
    setHowBlocks(res2);
  }
  /*  ------------------------------  */

  /*  For Contact Section */
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactBlocks, setContactBlocks] = useState([]);
  const [selectedContactBlock, setSelectedContactBlock] = useState({_id: null, css: '', field: '', display: '', isMultiline: null, num: ''});

  useEffect(() => {
    if (!contactModalVisible) {
      setSelectedContactBlock({_id: null, css: '', field: '', display: '', isMultiline: null, num: ''});
    }
  }, [contactModalVisible]);

  const handleContactBlockSaveBtn = async () => {
    if (!selectedContactBlock.field || !selectedContactBlock.display || !selectedContactBlock.num) {
      return;
    }
    if (selectedContactBlock._id) {
      await updateContactBlock(selectedContactBlock);
    } else {
      await addContactBlock(selectedContactBlock);
    }
    let res2 = await getContactBlocks();
    setContactBlocks(res2);
    setContactModalVisible(false);
  }

  const handleContactBlockDelBtn = async (id) => {
    let res1 = await deleteContactBlock(id);
    let res2 = await getContactBlocks();
    setContactBlocks(res2);
  }
  /*  ------------------------------  */

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

  const handleImageSaveBtn = async () => {
    let imagefile = document.getElementById('formFile');
    if (imagefile.files.length > 0) {
      let imageURL = await uploadFile(imagefile.files[0]);
      setLogoImageURL(`${API_URL}${imageURL}`);
      let res = await saveSetting({logo: API_URL + imageURL});
      setSetting(res);
    }
  }

  const handleHowSaveBtn = async () => {
    let res = await saveSetting({how: setting.how});
    setSetting(res);
  }

  const handleAboutSaveBtn = async () => {
    let res = await saveSetting({about: setting.about});
    setSetting(res);
  }

  const handleRoadmapSaveBtn = async () => {
    let res = await saveSetting({roadmap: setting.roadmap});
    setSetting(res);
  }

  const handleWhitepaperSaveBtn = async () => {
    let res = await saveSetting({whitepaper: setting.whitepaper});
    setSetting(res);
  }

  const handleTokenomicsSaveBtn = async () => {
    let res = await saveSetting({tokenomics: setting.tokenomics});
    setSetting(res);
  }
  const handleFaqSaveBtn = async () => {
    let res = await saveSetting({faq: setting.faq});
    setSetting(res);
  }
  const handleTeamSaveBtn = async () => {
    let res = await saveSetting({team: setting.team});
    setSetting(res);
  }
  const handleSubscribeSaveBtn = async () => {
    let res = await saveSetting({subscribe: setting.subscribe});
    setSetting(res);
  }
  const handleContactSaveBtn = async () => {
    let res = await saveSetting({contact: setting.contact});
    setSetting(res);
  }
  const handleMainSaveBtn = async () => {
    let res = await saveSetting({main: setting.main});
    setSetting(res);
  }

  useEffect(async () => {
    start();
    let res = await getSetting();
    setSetting(res);
    setLogoImageURL(res.logo ? res.logo : '/images/react400.jpg');
    res = await getHowBlocks();
    setHowBlocks(res);
    res = await getContactBlocks();
    setContactBlocks(res);
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
                <CCardImage orientation="top" src={logoImageURL} />
                <CCardBody>
                  <CCardTitle>Logo Image</CCardTitle>
                  <CCardText>
                    Please upload a site logo here.
                  </CCardText>
                  <CButton color="success" variant="outline" onClick={() => {document.getElementById('formFile').click()}}>Upload</CButton>
                  <CFormInput
                    type="file"
                    id="formFile"
                    name="formFile"
                    style={{display: 'none'}}
                    onChange={() => {
                      setLogoImageFileName(document.getElementById('formFile')?.files[0]?.name??'Not selected');
                      setLogoImageURL(URL.createObjectURL(document.getElementById('formFile')?.files[0]));
                    }}
                  />
                  <div>{logoImageFileName}</div>
                </CCardBody>
              </CCard>
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleImageSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "MainSection"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="special_title">Section Heading:</Label>
                <Input type="text" name="special_title" id="special_title" placeholder="ex. Initial Coin Offering"
                  value={setting.main?.title}
                  required
                  onChange={(e) => {setSetting({...setting, main: {...setting.main, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="main_title">Section Title:</Label>
                <Input type="text" name="main_title" id="main_title" placeholder="ex. Crypto ICO Project"
                  value={setting.main?.subtitle}
                  required
                  onChange={(e) => {setSetting({...setting, main: {...setting.main, subtitle: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="main_description">Section Description:</Label>
                <Input type="textarea" name="main_description" id="main_description" rows="6"
                  placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet dolorem blanditiis ad perferendis, labore delectus dolor sit amet, adipisicing elit."
                  value={setting.main?.detail}
                  required
                  onChange={(e) => {setSetting({...setting, main: {...setting.main, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleMainSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "AboutICO"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="about_ico_special_title">Section Heading:</Label>
                <Input
                  type="text"
                  name="about_ico_special_title"
                  id="about_ico_special_title"
                  placeholder="ex. About Crypto eComerce"
                  value={setting.about?.title}
                  required
                  onChange={(e) => {setSetting({...setting, about: {...setting.about, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="about_ico_title">Section Title:</Label>
                <Input
                  type="text"
                  name="about_ico_title"
                  id="about_ico_title"
                  placeholder="ex. Decenteralized Crypto eComerce"
                  value={setting.about?.subtitle}
                  required
                  onChange={(e) => {setSetting({...setting, about: {...setting.about, subtitle: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="about_ico_description">Section Description:</Label>
                <Input
                  type="textarea"
                  name="about_ico_description"
                  id="about_ico_description"
                  rows="8"
                  placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at dictum risus, non suscipit arcu. Quisque aliquam posuere tortor, sit amet convallis nunc scelerisque in. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit ipsa ut quasi adipisci voluptates, voluptatibus aliquid alias beatae reprehenderit incidunt iusto laboriosam."
                  value={setting.about?.detail}
                  required
                  onChange={(e) => {setSetting({...setting, about: {...setting.about, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleAboutSaveBtn}>Save</CButton>
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
                <Label for="howitworks_special_title">Section Heading:</Label>
                <Input
                  type="text"
                  name="howitworks_special_title"
                  id="howitworks_special_title"
                  placeholder="ex. How To Start"
                  value={setting.how?.title}
                  required
                  onChange={(e) => {setSetting({...setting, how: {...setting.how, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="howitworks_title">Section Title:</Label>
                <Input
                  type="text"
                  name="howitworks_title"
                  id="howitworks_title"
                  placeholder="ex. How It Works"
                  value={setting.how?.subtitle}
                  required
                  onChange={(e) => {setSetting({...setting, how: {...setting.how, subtitle: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="howitworks_description">Section Description:</Label>
                <Input
                  type="textarea"
                  name="howitworks_description"
                  id="howitworks_description"
                  rows="6"
                  placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo."
                  value={setting.how?.detail}
                  required
                  onChange={(e) => {setSetting({...setting, how: {...setting.how, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleHowSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
            <CRow id='adsf' style={{flexDirection: 'row-reverse'}}>
              <CCol sm="100%" style={{display: 'flex', flexDirection: 'row-reverse'}}>
                <CButton size="sm" color='secondary' onClick={()=>{setHowModalVisible(true)}}>Add</CButton>
              </CCol>
            </CRow>
            <CRow>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Text</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    howBlocks.map((block, index) => (
                      <CTableRow key={index}>
                        <CTableHeaderCell scope="row">{block.num}</CTableHeaderCell>
                        <CTableDataCell><img src={block.img} height={30}></img></CTableDataCell>
                        <CTableDataCell>{block.title}</CTableDataCell>
                        <CTableDataCell>{block.text}</CTableDataCell>
                        <CTableDataCell style={{minWidth: 120}}>
                          <CButton color="info" size="sm" onClick={()=>{setSelectedHowBlock(block); setHowModalVisible(true); setHowBlockImgURL(block.img)}}>Edit</CButton>
                          <CButton color="danger" size="sm"style={{marginLeft: 5}} onClick={() => handleHowBlockDelBtn(block._id)}>Delete</CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  }
                </CTableBody>
              </CTable>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "RoadMap"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="roadmap_special_title">Section Heading:</Label>
                <Input
                  type="text"
                  name="roadmap_special_title"
                  id="roadmap_special_title"
                  placeholder="ex. ICO Roadmap"
                  value={setting.roadmap?.title}
                  required
                  onChange={(e) => {setSetting({...setting, roadmap: {...setting.roadmap, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="roadmap_title">Section Title:</Label>
                <Input
                  type="text"
                  name="roadmap_title"
                  id="roadmap_title"
                  placeholder="ex. Our ICO Roadmap"
                  value={setting.roadmap?.subtitle}
                  required
                  onChange={(e) => {setSetting({...setting, roadmap: {...setting.roadmap, subtitle: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="roadmap_description">Section Description:</Label>
                <Input
                  type="textarea"
                  name="roadmap_description"
                  id="roadmap_description"
                  rows="6"
                  placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo."
                  value={setting.roadmap?.detail}
                  required
                  onChange={(e) => {setSetting({...setting, roadmap: {...setting.roadmap, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleRoadmapSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "WhitePaper"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="whitepaper_special_title">Section Heading:</Label>
                <Input type="text" name="whitepaper_special_title" id="whitepaper_special_title" placeholder="ex. Our ICO Whitepaper"
                  value={setting.whitepaper?.title}
                  required
                  onChange={(e) => {setSetting({...setting, whitepaper: {...setting.whitepaper, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="whitepaper_title">Section Title:</Label>
                <Input type="text" name="whitepaper_title" id="whitepaper_title" placeholder="ex. Downoad Our Whitepaper"
                  value={setting.whitepaper?.subtitle}
                  required
                  onChange={(e) => {setSetting({...setting, whitepaper: {...setting.whitepaper, subtitle: e.target.value}})}}
              />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="whitepaper_description">Section Description:</Label>
                <Input type="textarea" name="whitepaper_description" id="whitepaper_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore qui iste asperiores harum maiores praesentium facere ullam blanditiis, odio dolorum. Officia quisquam eaque suscipit facere ducimus, sit quaerat. Numquam, corrupti?"
                  value={setting.whitepaper?.detail}
                  required
                  onChange={(e) => {setSetting({...setting, whitepaper: {...setting.whitepaper, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleWhitepaperSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "Tokenomics"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="tokenomics_special_title">Section Heading:</Label>
                <Input type="text" name="tokenomics_special_title" id="tokenomics_special_title" placeholder="ex. About Our Token"
                  value={setting.tokenomics?.title}
                  required
                  onChange={(e) => {setSetting({...setting, tokenomics: {...setting.tokenomics, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="tokenomics_title">Section Title:</Label>
                <Input type="text" name="tokenomics_title" id="tokenomics_title" placeholder="ex. Our Token Info"
                  value={setting.tokenomics?.subtitle}
                  required
                  onChange={(e) => {setSetting({...setting, tokenomics: {...setting.tokenomics, subtitle: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="tokenomics_description">Section Description:</Label>
                <Input type="textarea" name="tokenomics_description" id="tokenomics_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo."
                  value={setting.tokenomics?.detail}
                  required
                  onChange={(e) => {setSetting({...setting, tokenomics: {...setting.tokenomics, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleTokenomicsSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "FAQ"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="faq_special_title">Section Heading:</Label>
                <Input type="text" name="faq_special_title" id="faq_special_title" placeholder="ex. Token FAQ"
                  value={setting.faq?.title}
                  required
                  onChange={(e) => {setSetting({...setting, faq: {...setting.faq, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="faq_title">Section Title:</Label>
                <Input type="text" name="faq_title" id="faq_title" placeholder="ex. Frequently Questions"
                  value={setting.faq?.subtitle}
                  required
                  onChange={(e) => {setSetting({...setting, faq: {...setting.faq, subtitle: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="faq_description">Section Description:</Label>
                <Input type="textarea" name="faq_description" id="faq_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo."
                value={setting.faq?.detail}
                required
                onChange={(e) => {setSetting({...setting, faq: {...setting.faq, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleFaqSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "Team"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="team_special_title">Section Heading:</Label>
                <Input type="text" name="team_special_title" id="team_special_title" placeholder="ex. Our Team"
                  value={setting.team?.title}
                  required
                  onChange={(e) => {setSetting({...setting, team: {...setting.team, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="team_title">Section Title:</Label>
                <Input type="text" name="team_title" id="team_title" placeholder="ex. Awesome Team"
                  value={setting.team?.subtitle}
                  required
                  onChange={(e) => {setSetting({...setting, team: {...setting.team, subtitle: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="team_description">Section Description:</Label>
                <Input type="textarea" name="team_description" id="team_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo."
                  value={setting.team?.detail}
                  required
                  onChange={(e) => {setSetting({...setting, team: {...setting.team, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleTeamSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "Subscribe"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="subscribe_title">Section Heading:</Label>
                <Input type="text" name="subscribe_title" id="subscribe_title" placeholder="ex. Don’t Miss ICO News And Updates!"
                  value={setting.subscribe?.title}
                  required
                  onChange={(e) => {setSetting({...setting, subscribe: {...setting.subscribe, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="subscribe_description">Section Description:</Label>
                <Input type="textarea" name="subscribe_description" id="subscribe_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo."
                  value={setting.subscribe?.detail}
                  required
                  onChange={(e) => {setSetting({...setting, subscribe: {...setting.subscribe, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleSubscribeSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>
        <CTabPane visible={activeKey === "ContactUs"}>
          <CContainer>
            <CRow>
              <CCol sm="6">
                <Label for="contactus_special_title">Section Heading:</Label>
                <Input type="text" name="contactus_special_title" id="contactus_special_title" placeholder="ex. Contact us"
                  value={setting.contact?.title}
                  required
                  onChange={(e) => {setSetting({...setting, contact: {...setting.contact, title: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="contactus_title">Section Title:</Label>
                <Input type="text" name="contactus_title" id="contactus_title" placeholder="ex. Contact With Us"
                  value={setting.contact?.subtitle}
                  required
                  onChange={(e) => {setSetting({...setting, contact: {...setting.contact, subtitle: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="6">
                <Label for="contactus_description">Section Description:</Label>
                <Input type="textarea" name="contactus_description" id="contactus_description" rows="6" placeholder="ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo."
                  value={setting.contact?.detail}
                  required
                  onChange={(e) => {setSetting({...setting, contact: {...setting.contact, detail: e.target.value}})}}
                />
              </CCol>
            </CRow>
            <br></br>
            <CRow>
              <CCol sm="auto">
                <CButton size="lg" onClick={handleContactSaveBtn}>Save</CButton>
              </CCol>
            </CRow>
            <CRow id='adsf' style={{flexDirection: 'row-reverse'}}>
              <CCol sm="100%" style={{display: 'flex', flexDirection: 'row-reverse'}}>
                <CButton size="sm" color='secondary' onClick={()=>{setContactModalVisible(true)}}>Add</CButton>
              </CCol>
            </CRow>
            <CRow>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Filed Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Display Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Css Classes</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Is Multiline</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    contactBlocks.map((block, index) => (
                      <CTableRow key={index}>
                        <CTableHeaderCell scope="row">{block.num}</CTableHeaderCell>
                        <CTableDataCell>{block.field}</CTableDataCell>
                        <CTableDataCell>{block.display}</CTableDataCell>
                        <CTableDataCell>{block.css}</CTableDataCell>
                        <CTableDataCell><CFormSwitch checked={block.isMultiline} disabled /></CTableDataCell>
                        <CTableDataCell style={{minWidth: 120}}>
                          <CButton color="info" size="sm" onClick={()=>{setSelectedContactBlock(block); setContactModalVisible(true);}}>Edit</CButton>
                          <CButton color="danger" size="sm"style={{marginLeft: 5}} onClick={() => handleContactBlockDelBtn(block._id)}>Delete</CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  }
                </CTableBody>
              </CTable>
            </CRow>
          </CContainer>
        </CTabPane>
      </CTabContent>

      {/* How */}
      <CModal visible={howModalVisible} onClose={() => setHowModalVisible(false)} alignment="center" backdrop='static'>
        <CModalHeader onClose={() => setHowModalVisible(false)}>
          <CModalTitle>Section Block Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CCard>
              <CCardImage orientation="top" src={howBlockImgURL} />
              <CCardBody>
                <CButton color="success" variant="outline" onClick={() => {document.getElementById('howBlockImg').click()}}>Select Image</CButton>
                <CFormInput
                  type="file"
                  id="howBlockImg"
                  name="howBlockImg"
                  required
                  style={{display: 'none'}}
                  onChange={() => {
                    setHowBlockImgFileName(document.getElementById('howBlockImg')?.files[0]?.name??'Not selected');
                    setHowBlockImgURL(URL.createObjectURL(document.getElementById('howBlockImg')?.files[0]));
                  }}
                />
                <div>{howBlockImgFileName}</div>
              </CCardBody>
            </CCard>
          <CFormInput
            type="text"
            label="Title"
            placeholder="ex. Register New Account"
            required
            value={selectedHowBlock?.title}
            onChange={(e) => {setSelectedHowBlock({...selectedHowBlock, title: e.target.value})}}
          />
          <CFormTextarea
            type="text"
            label="Text"
            placeholder="ex. Lorem ipsum dolor sit amet..."
            required
            value={selectedHowBlock?.text}
            onChange={(e) => {setSelectedHowBlock({...selectedHowBlock, text: e.target.value})}}
          />
          <CFormInput
            type="number"
            label="Order Number"
            value={selectedHowBlock?.num}
            required
            onChange={(e) => {setSelectedHowBlock({...selectedHowBlock, num: e.target.value})}}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setHowModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleHowBlockSaveBtn}>Save</CButton>
        </CModalFooter>
      </CModal>

      {/* Contact */}
      <CModal visible={contactModalVisible} onClose={() => setContactModalVisible(false)} alignment="center" backdrop='static'>
        <CModalHeader onClose={() => setContactModalVisible(false)}>
          <CModalTitle>Section Block Data</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            label="Field Name"
            placeholder="ex. email"
            required
            value={selectedContactBlock?.field}
            onChange={(e) => {setSelectedContactBlock({...selectedContactBlock, field: e.target.value})}}
          />
          <CFormInput
            type="text"
            label="Display Name"
            placeholder="ex. Email"
            required
            value={selectedContactBlock?.display}
            onChange={(e) => {setSelectedContactBlock({...selectedContactBlock, display: e.target.value})}}
          />
          <CFormInput
            type="text"
            label="CSS Class"
            placeholder="ex. col-12 col-md-6"
            required
            value={selectedContactBlock?.css}
            onChange={(e) => {setSelectedContactBlock({...selectedContactBlock, css: e.target.value})}}
          />
          <CFormInput
            type="number"
            label="Order Number"
            value={selectedContactBlock?.num}
            required
            onChange={(e) => {setSelectedContactBlock({...selectedContactBlock, num: e.target.value})}}
          />
          <br/>
          <CFormSwitch
            label="Is Multiline"
            checked={selectedContactBlock?.isMultiline}
            size="xl"
            onChange={(e) => {setSelectedContactBlock({...selectedContactBlock, isMultiline: e.target.checked})}}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setContactModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleContactBlockSaveBtn}>Save</CButton>
        </CModalFooter>
      </CModal>
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