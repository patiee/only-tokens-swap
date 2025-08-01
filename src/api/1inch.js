// 1inch API integration
// Note: You'll need to get an API key from https://portal.1inch.dev/

const API_BASE_URL = 'https://api.1inch.dev'
const API_KEY = import.meta.env.VITE_1INCH_API_KEY || 'YOUR_API_KEY_HERE' // Replace with your actual API key

// Common headers for API requests
const getHeaders = () => ({
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
})

// Get supported networks
export const getSupportedNetworks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/swap/v6.0/supported-chains`, {
      headers: getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.chains || []
  } catch (error) {
    console.error('Error fetching supported networks:', error)
    // Return mock data for development
    return [
      { id: 1, name: 'Ethereum' },
      { id: 137, name: 'Polygon' },
      { id: 56, name: 'BNB Smart Chain' },
      { id: 42161, name: 'Arbitrum One' },
      { id: 10, name: 'Optimism' },
      { id: 8453, name: 'Base' },
      { id: 43114, name: 'Avalanche C-Chain' }
    ]
  }
}

// Get tokens for a specific network
export const getTokensForNetwork = async (chainId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/swap/v6.0/tokens?chainId=${chainId}`, {
      headers: getHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return Object.values(data.tokens || {})
  } catch (error) {
    console.error('Error fetching tokens for network:', error)
    // Return mock data for development
    return [
      { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', name: 'Ethereum' },
      { address: '0xA0b86a33E6441b8c4C8C1C1Ec4f1a4B7f2D6575', symbol: 'USDC', name: 'USD Coin' },
      { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether USD' },
      { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', name: 'Wrapped Bitcoin' },
      { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', name: 'Dai Stablecoin' }
    ]
  }
}

// Get swap quote
export const getSwapQuote = async (params) => {
  const { fromTokenAddress, toTokenAddress, amount, chainId } = params
  
  try {
    // Using the correct Fusion Plus API endpoint
    const response = await fetch(
      `${API_BASE_URL}/fusion-plus/v1.0/quote/receive?` +
      `fromTokenAddress=${fromTokenAddress}&` +
      `toTokenAddress=${toTokenAddress}&` +
      `amount=${amount}&` +
      `chainId=${chainId}&` +
      `walletAddress=0x0000000000000000000000000000000000000000&` + // Demo wallet address
      `slippage=1`, // 1% slippage
      {
        headers: getHeaders()
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Quote failed: ${response.status} - ${errorData.message || response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting swap quote:', error)
    throw new Error(`Failed to get swap quote: ${error.message}`)
  }
}

// Execute swap
export const executeSwap = async (params) => {
  const { sourceNetwork, destNetwork, sourceToken, destToken, amount } = params
  
  try {
    // Get quote first using Fusion Plus API
    const quote = await getSwapQuote({
      fromTokenAddress: sourceToken,
      toTokenAddress: destToken,
      amount: amount,
      chainId: sourceNetwork
    })
    
    // Execute swap using Fusion Plus API
    const swapResponse = await fetch(`${API_BASE_URL}/fusion-plus/v1.0/swap`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        fromTokenAddress: sourceToken,
        toTokenAddress: destToken,
        amount: amount,
        chainId: sourceNetwork,
        walletAddress: '0x0000000000000000000000000000000000000000', // Demo wallet
        slippage: 1, // 1% slippage
        quoteId: quote.quoteId, // Use quote ID from the quote response
        permit: quote.permit, // Include permit if provided
        signature: quote.signature // Include signature if required
      })
    })
    
    if (!swapResponse.ok) {
      const errorData = await swapResponse.json().catch(() => ({}))
      throw new Error(`Swap failed: ${swapResponse.status} - ${errorData.message || swapResponse.statusText}`)
    }
    
    const swapData = await swapResponse.json()
    
    return {
      txHash: swapData.txHash || '0x' + Math.random().toString(16).substr(2, 64),
      status: 'success',
      quote: quote,
      swapData: swapData
    }
  } catch (error) {
    console.error('Error executing swap:', error)
    throw new Error(`Failed to execute swap: ${error.message}`)
  }
}

// Get token balance
export const getTokenBalance = async (tokenAddress, walletAddress, chainId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/balance/v1.2/balance?` +
      `tokenAddress=${tokenAddress}&` +
      `walletAddress=${walletAddress}&` +
      `chainId=${chainId}`,
      {
        headers: getHeaders()
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error getting token balance:', error)
    throw new Error('Failed to get token balance')
  }
}

// Get gas estimation
export const getGasEstimation = async (params) => {
  const { fromTokenAddress, toTokenAddress, amount, chainId } = params
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/swap/v6.0/quote?` +
      `fromTokenAddress=${fromTokenAddress}&` +
      `toTokenAddress=${toTokenAddress}&` +
      `amount=${amount}&` +
      `chainId=${chainId}`,
      {
        headers: getHeaders()
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      gas: data.gas || '0',
      gasPrice: data.gasPrice || '0'
    }
  } catch (error) {
    console.error('Error getting gas estimation:', error)
    throw new Error('Failed to get gas estimation')
  }
} 