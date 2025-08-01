import React, { useState, useEffect } from 'react'

function App() {
  const [networks] = useState([
    { id: 1, name: 'Ethereum' },
    { id: 137, name: 'Polygon' },
    { id: 56, name: 'BNB Smart Chain' },
    { id: 42161, name: 'Arbitrum One' },
    { id: 10, name: 'Optimism' },
    { id: 8453, name: 'Base' },
    { id: 43114, name: 'Avalanche C-Chain' }
  ])
  
  const [tokens] = useState([
    { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', name: 'Ethereum' },
    { address: '0xA0b86a33E6441b8c4C8C1C1Ec4f1a4B7f2D6575', symbol: 'USDC', name: 'USD Coin' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether USD' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', name: 'Wrapped Bitcoin' },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', name: 'Dai Stablecoin' }
  ])

  const [sourceNetwork, setSourceNetwork] = useState('')
  const [destNetwork, setDestNetwork] = useState('')
  const [sourceToken, setSourceToken] = useState('')
  const [destToken, setDestToken] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSwap = async () => {
    if (!sourceNetwork || !destNetwork || !sourceToken || !destToken || !amount) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    // Simulate swap
    setTimeout(() => {
      setSuccess(`Swap executed successfully! Transaction hash: 0x${Math.random().toString(16).substr(2, 64)}`)
      setAmount('')
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="app">
      <h1>1inch Swap</h1>
      
      <form className="swap-form" onSubmit={(e) => e.preventDefault()}>
        {/* Source Network */}
        <div className="form-group">
          <label htmlFor="sourceNetwork">From Network</label>
          <select
            id="sourceNetwork"
            value={sourceNetwork}
            onChange={(e) => setSourceNetwork(e.target.value)}
            disabled={loading}
          >
            <option value="">Select source network</option>
            {networks.map(network => (
              <option key={network.id} value={network.id}>
                {network.name}
              </option>
            ))}
          </select>
        </div>

        {/* Source Token */}
        <div className="form-group">
          <label htmlFor="sourceToken">From Token</label>
          <select
            id="sourceToken"
            value={sourceToken}
            onChange={(e) => setSourceToken(e.target.value)}
            disabled={loading || !sourceNetwork}
          >
            <option value="">Select source token</option>
            {tokens.map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
        </div>

        <div className="swap-arrow">↓</div>

        {/* Destination Network */}
        <div className="form-group">
          <label htmlFor="destNetwork">To Network</label>
          <select
            id="destNetwork"
            value={destNetwork}
            onChange={(e) => setDestNetwork(e.target.value)}
            disabled={loading}
          >
            <option value="">Select destination network</option>
            {networks.map(network => (
              <option key={network.id} value={network.id}>
                {network.name}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Token */}
        <div className="form-group">
          <label htmlFor="destToken">To Token</label>
          <select
            id="destToken"
            value={destToken}
            onChange={(e) => setDestToken(e.target.value)}
            disabled={loading || !destNetwork}
          >
            <option value="">Select destination token</option>
            {tokens.map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to swap"
            disabled={loading}
            min="0"
            step="0.000001"
          />
        </div>

        {/* Swap Button */}
        <button
          type="button"
          className="swap-button"
          onClick={handleSwap}
          disabled={loading || !sourceNetwork || !destNetwork || !sourceToken || !destToken || !amount}
        >
          {loading ? 'Swapping...' : 'Swap'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="success">
          {success}
        </div>
      )}
    </div>
  )
}

export default App 