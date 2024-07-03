'use client'

import { useState } from 'react'
import ContractList from '@/components/ContractList'
import ContractAnalysis from '@/components/ContractAnalysis'
import ErrorModal from '@/components/ErrorModal'
import FetchButton from '@/components/FetchButton'
import LoadingSpinner from '@/components/LoadingSpinner'
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
    <main className="container mx-auto py-10 px-4 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">Gas Tracker</h1>
      <div className="text-center mb-8">
        <FetchButton isLoading={isLoading} fetchHighGasContracts={fetchHighGasContracts} />
      </div>
      {error && <ErrorModal error={error} />}
      {isLoading && <LoadingSpinner />}
      {!isLoading && !contracts && (
        <div className="text-center">
          <img src="/assets/no-data.svg" alt="No data" className="mx-auto mb-4 w-1/2" />
          <p className="text-gray-500">Click the button to fetch high gas contracts.</p>
        </div>
      )}
      {contracts && <ContractList contracts={contracts} onSelectContract={setSelectedContract} />}
      {selectedContract && <ContractAnalysis contract={selectedContract} />}
    </main>
  )
}
