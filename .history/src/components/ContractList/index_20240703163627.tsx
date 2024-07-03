import React from 'react';
import { Contract } from '@/types';

interface ContractListProps {
  contracts: Contract[] | null | any;  // 添加 'any' 以处理未知的数据结构
  onSelectContract: (contract: Contract) => void;
}

const ContractList: React.FC<ContractListProps> = ({ contracts, onSelectContract }) => {
  if (contracts === null) {
    return <div>Loading contracts data...</div>;
  }

  if (!Array.isArray(contracts)) {
    console.error('Received non-array contracts data:', contracts);
    return <div>Error: Invalid data format received for contracts.</div>;
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
            <th className="px-4 py-2">Total Gas Used</th>
            <th className="px-4 py-2">Transaction Count</th>
            <th className="px-4 py-2">Average Gas Used</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract: Contract) => (
            <tr 
              key={contract.address}
              className="border-b cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectContract(contract)}
            >
              <td className="px-4 py-2">{contract.name || 'N/A'}</td>
              <td className="px-4 py-2">{contract.address}</td>
              <td className="px-4 py-2">{contract.totalGasUsed?.toLocaleString() || 'N/A'}</td>
              <td className="px-4 py-2">{contract.transactionCount?.toLocaleString() || 'N/A'}</td>
              <td className="px-4 py-2">
                {contract.averageGasUsed 
                  ? Math.round(contract.averageGasUsed).toLocaleString() 
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractList;