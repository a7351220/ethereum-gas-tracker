import { Contract } from '@/types'

interface ContractListProps {
  contracts: Contract[]
  onSelectContract: (contract: Contract) => void
}

const ContractList: React.FC<ContractListProps> = ({ contracts, onSelectContract }) => {
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
            <div className="text-sm text-gray-500">Gas Used: {contract.gasUsed}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ContractList
