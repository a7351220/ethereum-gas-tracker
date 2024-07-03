'use client'

import { useState, useEffect } from 'react'
import { Contract, ContractAnalysis as ContractAnalysisType } from '@/types'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }
        const data: ContractAnalysisType = await response.json()
        setAnalysis(data.analysis)
      } catch (error) {
        console.error('Error analyzing contract:', error)

        let errorMessage = 'An unknown error occurred.'
        if (error instanceof Error) {
          errorMessage = error.message
        }

        toast.error(`Error: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setAnalysis(`Error: ${errorMessage}`)
      }
      setIsLoading(false)
    }

    fetchAnalysis()
  }, [contract])

  return (
    <div className="mt-8 w-full lg:w-1/3">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Contract Analysis</h2>
      <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <div className="font-semibold mb-2 text-gray-700 break-all">{contract.address}</div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-gray-700">{analysis}</pre>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

export default ContractAnalysis
