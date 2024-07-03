'use client'

import { useState } from 'react'
import ContractList from '@/components/ContractList'
import ContractAnalysis from '@/components/ContractAnalysis'
import { Contract } from '@/types'

export default function Home() {
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHighGasContracts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/getHighGasContracts');
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('Error fetching high gas contracts:', error);
    }
    setIsLoading(false);
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Gas Tracker</h1>
      <div className="text-center mb-8">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={fetchHighGasContracts}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get High Gas Contracts'}
        </button>
      </div>
      <ContractList 
        contracts={contracts} 
        onSelectContract={setSelectedContract}
      />
      {selectedContract && (
        <ContractAnalysis contract={selectedContract} />
      )}
    </main>
  )
}