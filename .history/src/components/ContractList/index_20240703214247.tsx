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
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">High Gas Consuming Contracts</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-gray-600 font-medium">Contract Name</th>
            <th className="px-6 py-3 text-left text-gray-600 font-medium">Address</th>
            <th className="px-6 py-3 text-left text-gray-600 font-medium">Total Gas Cost (ETH)</th>
            <th className="px-6 py-3 text-left text-gray-600 font-medium">Average Gas Cost (ETH)</th>
            <th className="px-6 py-3 text-left text-gray-600 font-medium">Transaction Count</th>
            <th className="px-6 py-3 text-left text-gray-600 font-medium">Analyze</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.address} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{contract.name}</td>
              <td className="px-6 py-4">{contract.address}</td>
              <td className="px-6 py-4">{(contract.totalGasCost / 1e18).toFixed(4)}</td>
              <td className="px-6 py-4">{(contract.averageGasCost / 1e18).toFixed(4)}</td>
              <td className="px-6 py-4">{contract.transactionCount}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelectContract(contract)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-300"
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractList;
