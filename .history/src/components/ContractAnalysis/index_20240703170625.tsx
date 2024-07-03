import React, { useState } from 'react';
import axios from 'axios';

interface ContractAnalysisProps {
  address: string;
}

const ContractAnalysis: React.FC<ContractAnalysisProps> = ({ address }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeContract = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/analyzeContract', { address });
      setAnalysis(response.data.analysis);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'An error occurred while analyzing the contract.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={analyzeContract} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze Contract'}
      </button>
      {analysis && <div>{analysis}</div>}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button 
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setError(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractAnalysis;