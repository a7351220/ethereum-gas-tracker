'use client'

import { useState, useEffect } from 'react'
import { Contract, ContractAnalysis as ContractAnalysisType } from '@/types'

interface ContractAnalysisProps {
  contract: Contract
}

const ContractAnalysis: React.FC<ContractAnalysisProps> = ({ contract }) => {
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
          body: JSON.stringify({ address: contract.address }),
        })
        const data: ContractAnalysisType = await response.json()
        setAnalysis(data.analysis)
      } catch (error) {
        console.error('Error analyzing contract:', error)
        setAnalysis('Failed to analyze contract')
      }
      setIsLoading(false)
    }

    fetchAnalysis()
  }, [contract])

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Contract Analysis</h2>
      <div className="p-4 border border-gray-200 rounded-md">
        <div className="font-semibold mb-2">{contract.address}</div>
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        ) : (
          <pre className="whitespace-pre-wrap">{analysis}</pre>
        )}
      </div>
    </div>
  )
}

export default ContractAnalysis
