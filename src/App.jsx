import React, { useState, useEffect, useRef } from 'react'
import { executeSwap, getTokensForNetwork } from './api/1inch.js'
import './App.css'

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
  const [loadingTokens, setLoadingTokens] = useState(false)
  
  // Search states for token filtering
  const [sourceTokenSearch, setSourceTokenSearch] = useState('')
  const [destTokenSearch, setDestTokenSearch] = useState('')
  const [showSourceTokenDropdown, setShowSourceTokenDropdown] = useState(false)
  const [showDestTokenDropdown, setShowDestTokenDropdown] = useState(false)

  // Refs for dropdown containers
  const sourceTokenRef = useRef(null)
  const destTokenRef = useRef(null)

  // Filter tokens based on search input
  const filteredSourceTokens = sourceTokens.filter(token =>
    token.symbol?.toLowerCase().includes(sourceTokenSearch.toLowerCase()) ||
    token.name?.toLowerCase().includes(sourceTokenSearch.toLowerCase()) ||
    token.address?.toLowerCase().includes(sourceTokenSearch.toLowerCase())
  )

  const filteredDestTokens = destTokens.filter(token =>
    token.symbol?.toLowerCase().includes(destTokenSearch.toLowerCase()) ||
    token.name?.toLowerCase().includes(destTokenSearch.toLowerCase()) ||
    token.address?.toLowerCase().includes(destTokenSearch.toLowerCase())
  )

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceTokenRef.current && !sourceTokenRef.current.contains(event.target)) {
        setShowSourceTokenDropdown(false)
      }
      if (destTokenRef.current && !destTokenRef.current.contains(event.target)) {
        setShowDestTokenDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch tokens when source network changes
  useEffect(() => {
    if (sourceNetwork) {
      setLoadingTokens(true)
      getTokensForNetwork(sourceNetwork)
        .then(tokens => {
          setSourceTokens(tokens)
          setSourceToken('') // Reset token selection
          setSourceTokenSearch('') // Reset search
        })
        .catch(err => {
          console.error('Error loading source tokens:', err)
          setSourceTokens([])
        })
        .finally(() => {
          setLoadingTokens(false)
        })
    } else {
      setSourceTokens([])
      setSourceToken('')
      setSourceTokenSearch('')
    }
  }, [sourceNetwork])

  // Fetch tokens when destination network changes
  useEffect(() => {
    if (destNetwork) {
      setLoadingTokens(true)
      getTokensForNetwork(destNetwork)
        .then(tokens => {
          setDestTokens(tokens)
          setDestToken('') // Reset token selection
          setDestTokenSearch('') // Reset search
        })
        .catch(err => {
          console.error('Error loading destination tokens:', err)
          setDestTokens([])
        })
        .finally(() => {
          setLoadingTokens(false)
        })
    } else {
      setDestTokens([])
      setDestToken('')
      setDestTokenSearch('')
    }
  }, [destNetwork])

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
      setSuccess('Swap executed successfully!')
      console.log('Swap result:', result)
    } catch (err) {
      setError(`Swap failed: ${err.message}`)
      console.error('Swap error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle token selection from dropdown
  const handleSourceTokenSelect = (token) => {
    setSourceToken(token.address)
    setSourceTokenSearch(`${token.symbol} - ${token.name}`)
    setShowSourceTokenDropdown(false)
  }

  const handleDestTokenSelect = (token) => {
    setDestToken(token.address)
    setDestTokenSearch(`${token.symbol} - ${token.name}`)
    setShowDestTokenDropdown(false)
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

        {/* Source Token with Search */}
        <div className="form-group">
          <label htmlFor="sourceToken">From Token</label>
          <div className="token-select-container" ref={sourceTokenRef}>
            <input
              type="text"
              placeholder={loadingTokens ? 'Loading tokens...' : 'Search source token...'}
              value={sourceTokenSearch}
              onChange={(e) => {
                setSourceTokenSearch(e.target.value)
                setShowSourceTokenDropdown(true)
              }}
              onFocus={() => setShowSourceTokenDropdown(true)}
              disabled={loading || !sourceNetwork || loadingTokens}
              className="token-search-input"
            />
            {showSourceTokenDropdown && filteredSourceTokens.length > 0 && (
              <div className="token-dropdown">
                {filteredSourceTokens.slice(0, 10).map(token => (
                  <div
                    key={token.address}
                    className="token-option"
                    onClick={() => handleSourceTokenSelect(token)}
                  >
                    <div className="token-info">
                      <span className="token-symbol">{token.symbol}</span>
                      <span className="token-name">{token.name}</span>
                    </div>
                    <span className="token-address">{token.address.slice(0, 6)}...{token.address.slice(-4)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
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

        {/* Destination Token with Search */}
        <div className="form-group">
          <label htmlFor="destToken">To Token</label>
          <div className="token-select-container" ref={destTokenRef}>
            <input
              type="text"
              placeholder={loadingTokens ? 'Loading tokens...' : 'Search destination token...'}
              value={destTokenSearch}
              onChange={(e) => {
                setDestTokenSearch(e.target.value)
                setShowDestTokenDropdown(true)
              }}
              onFocus={() => setShowDestTokenDropdown(true)}
              disabled={loading || !destNetwork || loadingTokens}
              className="token-search-input"
            />
            {showDestTokenDropdown && filteredDestTokens.length > 0 && (
              <div className="token-dropdown">
                {filteredDestTokens.slice(0, 10).map(token => (
                  <div
                    key={token.address}
                    className="token-option"
                    onClick={() => handleDestTokenSelect(token)}
                  >
                    <div className="token-info">
                      <span className="token-symbol">{token.symbol}</span>
                      <span className="token-name">{token.name}</span>
                    </div>
                    <span className="token-address">{token.address.slice(0, 6)}...{token.address.slice(-4)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
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