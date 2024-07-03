"use client"
import React, { useState, useEffect } from 'react';

interface ContractInfo {
  address: string;
  name: string;
  totalGasUsed: number;
  transactionCount: number;
  averageGasUsed: number;
}

const HighGasContracts: React.FC = () => {
  const [contracts, setContracts] = useState<ContractInfo[]>([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('/api/getHighGasContracts');
        const data = await response.json();
        setContracts(data);
      } catch (error) {
        console.error('Error fetching high gas contracts:', error);
      }
    };

    fetchContracts();
  }, []);

  return (
    <div>
      <h2>High GAS Consuming Contracts</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Contract Name</th>
            <th>Address</th>
            <th>Total GAS Used</th>
            <th>Transaction Count</th>
            <th>Average GAS Used</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <tr key={contract.address}>
              <td>{index + 1}</td>
              <td>{contract.name}</td>
              <td>{contract.address}</td>
              <td>{contract.totalGasUsed.toLocaleString()}</td>
              <td>{contract.transactionCount}</td>
              <td>{contract.averageGasUsed.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HighGasContracts;