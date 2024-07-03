import React, { useEffect } from 'react';
import { Contract } from '@/types';

interface ContractListProps {
  contracts: Contract[] | null;
  onSelectContract: (contract: Contract) => void;
}

const ContractList: React.FC<ContractListProps> = ({ contracts, onSelectContract }) => {
  useEffect(() => {
    console.log('Received contracts data:', contracts);
  }, [contracts]);

  if (!contracts) {
    return <div>No contracts data available.</div>;
  }

  if (!Array.isArray(contracts)) {
    console.error('Contracts data is not an array:', contracts);
    return <div>Error: Invalid contracts data format.</div>;
  }

  if (contracts.length === 0) {
    return <div>No high gas contracts found.</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">High Gas Contracts</h2>
      <ul className="space-y-3">
        {contracts.map((contract) => (
          <li 
            key={contract.address}
            className="p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectContract(contract)}
          >
            <div className="font-semibold">{contract.address}</div>
            {/* 显示所有可用的合约属性 */}
            {Object.entries(contract).map(([key, value]) => (
              <div key={key} className="text-sm text-gray-500">
                {key}: {JSON.stringify(value)}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContractList;