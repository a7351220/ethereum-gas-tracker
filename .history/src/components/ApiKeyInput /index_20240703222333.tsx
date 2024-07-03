'use client'

import React, { useState, useEffect } from 'react'

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    const storedApiKey = localStorage.getItem('etherscanApiKey')
    if (storedApiKey) {
      setApiKey(storedApiKey)
      onApiKeyChange(storedApiKey)
    }
  }, [onApiKeyChange])

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value
    setApiKey(newApiKey)
    localStorage.setItem('etherscanApiKey', newApiKey)
    onApiKeyChange(newApiKey)
  }

  return (
    <div className="mb-4">
      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
        Etherscan API Key
      </label>
      <input
        type="text"
        id="apiKey"
        value={apiKey}
        onChange={handleApiKeyChange}
        placeholder="Enter your Etherscan API key"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  )
}

export default ApiKeyInput