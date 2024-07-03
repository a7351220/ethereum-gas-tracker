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
            <th className="px-4 py-2">Total Gas Used</th>
            <th className="px-4 py-2">Transaction Count</th>
            <th className="px-4 py-2">Average Gas Used</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr 
              key={contract.address}
              className="border-b cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectContract(contract)}
            >
              <td className="px-4 py-2">{contract.name}</td>
              <td className="px-4 py-2">{contract.address}</td>
              <td className="px-4 py-2">{contract.totalGasUsed.toLocaleString()}</td>
              <td className="px-4 py-2">{contract.transactionCount.toLocaleString()}</td>
              <td className="px-4 py-2">{Math.round(contract.averageGasUsed).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractList;