import 'dotenv/config'; 
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const PORT = 3001

// Enable CORS for all routes
app.use(cors())
app.use(express.json())

// Proxy endpoint for 1inch API
app.get('/api/quote', async (req, res) => {
  try {
    const { srcChain, destChain, srcTokenAddress, dstTokenAddress, amount, walletAddress } = req.query
    
    const API_KEY = process.env.INCH_API_KEY || 'YOUR_API_KEY_HERE'
    const API_BASE_URL = 'https://api.1inch.dev'

    console.log('API_KEY:', API_KEY)
    
    const response = await fetch(
      `${API_BASE_URL}/fusion-plus/v1.0/quote/receive?` +
      `srcChain=${srcChain}&` +
      `destChain=${destChain}&` +
      `srcTokenAddress=${srcTokenAddress}&` +
      `dstTokenAddress=${dstTokenAddress}&` +
      `amount=${amount}&` +
      `walletAddress=${walletAddress}&` +
      `enableEstimate=false&` +
      `fee=1`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: `Quote failed: ${response.status} - ${errorData.message || response.statusText}`
      })
    }
    
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: `Proxy error: ${error.message}` })
  }
})

// Proxy endpoint for swap execution
app.post('/api/swap', async (req, res) => {
  try {
    const { srcChain, destChain, srcTokenAddress, dstTokenAddress, amount, walletAddress, quoteId } = req.body
    
    const API_KEY = process.env.INCH_API_KEY || 'YOUR_API_KEY_HERE'
    const API_BASE_URL = 'https://api.1inch.dev'

    console.log('API_KEY:', API_KEY)
    
    const response = await fetch(`${API_BASE_URL}/fusion-plus/v1.0/swap`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        srcChain,
        destChain,
        srcTokenAddress,
        dstTokenAddress,
        amount,
        walletAddress,
        quoteId,
        fee: 1
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: `Swap failed: ${response.status} - ${errorData.message || response.statusText}`
      })
    }
    
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: `Proxy error: ${error.message}` })
  }
})

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
}) 