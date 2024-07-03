import React from 'react';
import { Contract } from '@/types';

interface ContractListProps {
  contracts: Contract[] | null;
  onSelectContract: (contract: Contract) => void;
}

const ContractList: React.FC<ContractListProps> = ({ contracts, onSelectContract }) => {
  if (!contracts) {
    return <div>Loading contracts data...</div>;
  }

  if (contracts.length === 0) {
    return <div>No high gas contracts found.</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">High Gas Consuming Contracts</h2>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Contract Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Total Gas Cost (ETH)</th>
            <th className="px-4 py-2">Average Gas Cost (ETH)</th>
            <th className="px-4 py-2">Transaction Count</th>
            <th className="px-4 py-2">Analyze</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.address} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{contract.name}</td>
              <td className="px-4 py-2">{contract.address}</td>
              <td className="px-4 py-2">{(contract.totalGasCost / 1e18).toFixed(4)}</td>
              <td className="px-4 py-2">{(contract.averageGasCost / 1e18).toFixed(4)}</td>
              <td className="px-4 py-2">{contract.transactionCount}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onSelectContract(contract)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
