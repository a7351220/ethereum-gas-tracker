// Home.tsx

'use client'

import { useState } from 'react'
import ContractList from '@/components/ContractList'
import ContractAnalysis from '@/components/ContractAnalysis'
import { Contract } from '@/types'

export default function Home() {
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHighGasContracts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/getHighGasContracts');
      const data = await response.json();
      if (data.error) {
        setError(`${data.error}: ${data.details}`);
      } else {
        setContracts(data);
      }
    } catch (error) {
      setError('Failed to fetch contract data. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Gas Tracker</h1>
      <div className="text-center mb-8">
        <button 
          className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
          onClick={fetchHighGasContracts}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get High Gas Contracts'}
        </button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {contracts && (
        <ContractList 
          contracts={contracts} 
          onSelectContract={setSelectedContract}
        />
      )}
      {selectedContract && (
        <ContractAnalysis contract={selectedContract} />
      )}
    </main>
  )
}
