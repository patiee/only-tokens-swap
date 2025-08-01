import React, { useState, useEffect } from 'react'
import { getSupportedNetworks, getTokensForNetwork, executeSwap } from './api/1inch'

function App() {
  const [networks, setNetworks] = useState([])
  const [sourceNetwork, setSourceNetwork] = useState('')
  const [destNetwork, setDestNetwork] = useState('')
  const [sourceTokens, setSourceTokens] = useState([])
  const [destTokens, setDestTokens] = useState([])
  const [sourceToken, setSourceToken] = useState('')
  const [destToken, setDestToken] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadNetworks()
  }, [])

  useEffect(() => {
    if (sourceNetwork) {
      loadTokensForNetwork(sourceNetwork, setSourceTokens)
    }
  }, [sourceNetwork])

  useEffect(() => {
    if (destNetwork) {
      loadTokensForNetwork(destNetwork, setDestTokens)
    }
  }, [destNetwork])

  const loadNetworks = async () => {
    try {
      const networkList = await getSupportedNetworks()
      setNetworks(networkList)
    } catch (err) {
      setError('Failed to load networks')
      console.error('Error loading networks:', err)
    }
  }

  const loadTokensForNetwork = async (network, setTokens) => {
    try {
      const tokens = await getTokensForNetwork(network)
      setTokens(tokens)
    } catch (err) {
      setError(`Failed to load tokens for ${network}`)
      console.error('Error loading tokens:', err)
    }
  }

  const handleSwap = async () => {
    if (!sourceNetwork || !destNetwork || !sourceToken || !destToken || !amount) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await executeSwap({
        sourceNetwork,
        destNetwork,
        sourceToken,
        destToken,
        amount
      })
      
      setSuccess(`Swap executed successfully! Transaction hash: ${result.txHash}`)
      setAmount('')
    } catch (err) {
      setError(err.message || 'Failed to execute swap')
      console.error('Swap error:', err)
    } finally {
      setLoading(false)
    }
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
            {sourceTokens.map(token => (
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
            {destTokens.map(token => (
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