import React from 'react';

interface Contract {
  address: string;
  name: string;
  totalGasUsed: number;
  transactionCount: number;
  averageGasUsed: number;
}

interface ContractListProps {
  contracts: Contract[] | null;
  onSelectContract: (contract: Contract) => void;
}

const ContractList: React.FC<ContractListProps> = ({ contracts, onSelectContract }) => {
  if (!contracts) {
    return <div className="text-center py-4">Loading contracts data...</div>;
  }

  if (!Array.isArray(contracts)) {
    console.error('Contracts data is not an array:', contracts);
    return <div className="text-center py-4 text-red-500">Error: Invalid contracts data format.</div>;
  }

  if (contracts.length === 0) {
    return <div className="text-center py-4">No high gas contracts found.</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">High Gas Consuming Contracts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Contract Name</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-right">Total Gas Used</th>
              <th className="px-4 py-2 text-right">Tx Count</th>
              <th className="px-4 py-2 text-right">Avg Gas Used</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr 
                key={contract.address}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectContract(contract)}
              >
                <td className="px-4 py-2">{contract.name || 'Unknown'}</td>
                <td className="px-4 py-2 font-mono text-sm">{contract.address}</td>
                <td className="px-4 py-2 text-right">{contract.totalGasUsed.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{contract.transactionCount.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{Math.round(contract.averageGasUsed).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractList;