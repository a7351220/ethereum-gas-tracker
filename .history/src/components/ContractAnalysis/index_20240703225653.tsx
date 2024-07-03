'use client'

import { useState, useEffect } from 'react'
import { Contract, ContractAnalysis as ContractAnalysisType } from '@/types'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ContractAnalysisProps {
  contract: Contract;
  apiKeys: {
    etherscan: string;
    openai: string;
  };
}

const ContractAnalysis: React.FC<ContractAnalysisProps> = ({ contract, apiKeys }) => {
  const [analysis, setAnalysis] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/analyzeContract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            address: contract.address, 
            etherscanApiKey: apiKeys.etherscan,
            openaiApiKey: apiKeys.openai
          }),
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: ContractAnalysisType = await response.json()
        setAnalysis(data.analysis)
      } catch (error) {
        console.error('Error analyzing contract:', error)
        toast.error('Failed to analyze contract. Please try again later.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setAnalysis('Failed to analyze contract')
      }
      setIsLoading(false)
    }

    if (apiKeys.etherscan && apiKeys.openai) {
      fetchAnalysis()
    }
  }, [contract, apiKeys])

  return (
    <div className="mb-8 w-full px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Contract Analysis</h2>
      <div className="overflow-hidden shadow-md rounded-lg">
        <div className="bg-white px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Contract Address</h3>
          <p className="text-gray-600 mb-4">{contract.address}</p>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Analysis</h3>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-600 bg-gray-50 p-4 rounded-md">{analysis}</pre>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ContractAnalysis