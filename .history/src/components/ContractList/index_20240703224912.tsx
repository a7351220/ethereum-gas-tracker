import React from 'react';
import { Contract } from '@/types';

interface ContractListProps {
  contracts: Contract[] | null;
  onSelectContract: (contract: Contract) => void;
}

const ContractList: React.FC<ContractListProps> = ({ contracts, onSelectContract }) => {
  if (!contracts) {
    return <div className="text-center text-gray-500">Loading contracts data...</div>;
  }

  if (contracts.length === 0) {
    return <div className="text-center text-gray-500">No high gas contracts found.</div>;
  }

  return (
    <div className="mb-8 w-full px-4 sm:px-6 lg:px-8"> {/* Increased horizontal padding */}
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">High Gas Consuming Contracts</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-b border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Gas Cost (ETH)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Gas Cost (ETH)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tx Count</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analyze</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.address} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{contract.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{contract.address}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{(contract.totalGasCost / 1e18).toFixed(4)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{(contract.averageGasCost / 1e18).toFixed(4)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{contract.transactionCount}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => onSelectContract(contract)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-all duration-300 text-xs"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractList;