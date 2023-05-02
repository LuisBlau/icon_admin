import { ethers } from "ethers"
import { chains } from "src/constants/chains"
import {
  ETHERSCAN_API_KEY,
  CROWDSALE_ADDRESS,
  CROWDSALE_TOKEN_ADDRESS,
  CROWDSALE_ABI,
  CROWDSALE_TOKEN_ABI
} from '../constants/contracts'

const getCrowdSaleReader = () => {
  // console.log("ETHERSCAN_API_KEY", ETHERSCAN_API_KEY);
  const  provider = new ethers.providers.EtherscanProvider(chains.ETHEREUM_SEPOLIA, ETHERSCAN_API_KEY)
  const contract = new ethers.Contract(CROWDSALE_ADDRESS, CROWDSALE_ABI, provider)
  return contract
}

const getCrowdSaleWriter = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
  const signer = provider.getSigner()
  const contract = new ethers.Contract(CROWDSALE_ADDRESS, CROWDSALE_ABI, signer)
  return contract
}

const getCrowdSaleTokenReader = () => {
  // console.log("ETHERSCAN_API_KEY2", ETHERSCAN_API_KEY);
  const  provider = new ethers.providers.EtherscanProvider(chains.ETHEREUM_SEPOLIA, ETHERSCAN_API_KEY)
  const contract = new ethers.Contract(CROWDSALE_TOKEN_ADDRESS, CROWDSALE_TOKEN_ABI, provider)
  return contract
}

const getCrowdSaleTokenWriter = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
  const signer = provider.getSigner()
  const contract = new ethers.Contract(CROWDSALE_TOKEN_ADDRESS, CROWDSALE_TOKEN_ABI, signer)
  return contract
}

export const getHistory = async () => {
  // console.log("ETHERSCAN_API_KEY3", ETHERSCAN_API_KEY);
  const provider = new ethers.providers.EtherscanProvider(chains.ETHEREUM_SEPOLIA,ETHERSCAN_API_KEY);
  const history = await provider.getHistory(CROWDSALE_ADDRESS);
  return history.reverse()
}

export const getStaticTokenInfo = async () => {
  const contract = getCrowdSaleTokenReader()
  const name = await contract.name()
  const symbol = await contract.symbol()
  const decimals = await contract.decimals()
  const owner = await contract.owner()
  return {
    name: name.toString(),
    symbol: symbol.toString(),
    decimals: decimals.toString(),
    owner: owner.toString()
  }
}

export const getTotalSupply = async () => {
  const contract = getCrowdSaleTokenReader()
  const totalSupply  =  await contract.totalSupply()
  return totalSupply.toString() / 10**18
}

export const getMintingStatus = async () => {
  const contract = getCrowdSaleTokenReader()
  const paused = await contract.paused()
  return paused
}

export const mint = async (address, num) => {
  const contract = await getCrowdSaleTokenWriter()
  try {
    await contract.mint(address, num)
    return {
      success: true,
      message:`${num} SUMMER tokens minted`
    }
  } catch (e) {
    return {
      success: false,
      message: e.reason || e.message
    }
  }
}

export const pause = async () => {
  const contract = await getCrowdSaleTokenWriter()
  try {
    await contract.pause()
    return {
      success: true,
      message: "Minting paused"
    }
  } catch (e) {
    return {
      success: false,
      message: e.reason || e.message || "Pausing failed"
    }
  }
}

export const unPause = async () => {
  const contract = await getCrowdSaleTokenWriter()
  try {
    await contract.unPause()
    return {
      success: true,
      message: "Minting resumed"
    }
  } catch (e) {
    return {
      success: false,
      message: e.reason || e.message || "Resuming failed"
    }
  }
}

export const setAdminPermission = async (address) => {
  const contract = await getCrowdSaleWriter()
  try {
    await contract.setAdminPermission(address, true)
    return {
      success: true,
      message: "New admin set"
    }
  } catch (e) {
    return {
      success: false,
      message: e.reason || e.message
    }
  }
}

export const removeAdminPermission = async (address) => {
  const contract = await getCrowdSaleWriter()
  try {
    await contract.setAdminPermission(address, false)
    return {
      success: true,
      message: "An admin removed"
    }
  } catch (e) {
    return {
      success: false,
      message: e.reason || e.message
    }
  }
}

export const setTokenRate = async (val) => {
  const contract = await getCrowdSaleWriter()
  try {
    await contract.setRate(val)
    return {
      success: true,
      message: "New rate set"
    }
  } catch (e) {
    return {
      success: false,
      message: e.reason || e.message
    }
  }
}

export const getRate = async () => {
  const contract = getCrowdSaleReader()
  const rate = await contract.rate()
  return rate.toString()
}

export const getTokensSold = async () => {
  const contract = getCrowdSaleReader()
  const tokens = await contract.tokensSold()
  return tokens.toString() / 10**18
};

export const getRaisdFunds = async () => {
  const contract = getCrowdSaleReader()
  const balance = await contract.fundsRaised()
  return balance.toString() / 10**18
}

export const getForwardedFunds = async () => {
  const contract = getCrowdSaleReader()
  const balance = await contract.fundsForwarded()
  return balance.toString() / 10**18
}

export const getCurrentTokens = async () => {
  const contract = getCrowdSaleReader()
  const balance = await contract.tokenBalance()
  return balance.toString() / 10**18
}

export const getCrowdSaleStatus = async () => {
  const contract = getCrowdSaleReader()
  const startedAt = await contract.crowdSaleStartedAt()
  if (startedAt.toString() === "0")
    return false
  else
    return true
}

export const getForwardability = async () => {
  const contract = getCrowdSaleReader()
  const isForwardable = await contract.isForwardable()
  return isForwardable
}

export const startCrowdSale = async () => {
  const contract = await getCrowdSaleWriter()
  try {
    await contract.startCrowdSale()
    return {
      success: true,
      message: "Crowd Sale started!"
    }
  } catch (e) {
    return {
      success: false,
      message: e.reason || e.message || "CrowdSale is Active!"
    }
  }
}

export const terminateCrowdSale = async () => {
  const contract = await getCrowdSaleWriter()
  try {
    await contract.terminateCrowdSale()
    return {
      success: true,
      message: "Crowd Sale terminated!"
    }
  } catch (e) {
    return {
      success: false,
      message: e.reason || e.message || "CrowdSale is not Active!"
    }
  }
}

export const forwardFunds = async () => {
  const contract = await getCrowdSaleWriter()
  try {
    await contract.forwardFunds()
    return {
      success: true,
      message: "ETH Tokens collected"
    }
  } catch (e) {
    const isForwardable = await getForwardability()
    return {
      success: false,
      message: 
        e.reason || e.message || 
        isForwardable ? "CrowdSale is not Active!" : "Today's funds already collected!"
    }
  }
}

export const forwardTokens = async () => {
  const contract = await getCrowdSaleWriter()
  try {
    await contract.forwardTokens()
    return {
      success: true,
      message: "SUMMER Tokens collected"
    }
  } catch (e) {
    return {
      success: false,
      message: 
        e.reason || e.message || "CrowdSale is not Active!"
    }
  }
}

export const getAuth = async (address) => {
  const contract = getCrowdSaleReader()
  const status = await contract.adminsWhitelist(address)
  return status
}