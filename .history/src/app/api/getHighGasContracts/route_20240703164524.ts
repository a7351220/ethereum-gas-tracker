import { NextResponse } from 'next/server'
import axios from 'axios'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

if (!ETHERSCAN_API_KEY) {
  console.error('ETHERSCAN_API_KEY is not set in the environment variables')
}

interface Transaction {
  to: string
  gas: string
  gasPrice: string
}

interface EtherscanApiResponse {
  jsonrpc: string
  id: number
  result: {
    transactions: Transaction[]
  }
}

interface ContractGasUsage {
  address: string
  totalGasUsed: number
  totalGasCost: number
  transactionCount: number
}

interface ContractInfo extends ContractGasUsage {
  name: string
  averageGasUsed: number
  averageGasCost: number
}

async function getContractName(address: string): Promise<string> {
  try {
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: ETHERSCAN_API_KEY
      }
    })
    return response.data.result[0].ContractName || 'Unknown'
  } catch (error) {
    console.error(`Error fetching contract name for ${address}:`, error)
    return 'Unknown'
  }
}

export async function GET() {
  try {
    const response = await axios.get<EtherscanApiResponse>('https://api.etherscan.io/api', {
      params: {
        module: 'proxy',
        action: 'eth_getBlockByNumber',
        tag: 'latest',
        boolean: true,
        apikey: ETHERSCAN_API_KEY
      }
    })

    if ('error' in response.data) {
      throw new Error(`Etherscan API error: ${(response.data as any).error.message}`)
    }

    if (!response.data.result || !response.data.result.transactions) {
      throw new Error('Unexpected response format from Etherscan API')
    }

    const transactions = response.data.result.transactions

    const contractGasUsage: Record<string, ContractGasUsage> = {}
    transactions.forEach(tx => {
      if (tx.to) {
        if (!contractGasUsage[tx.to]) {
          contractGasUsage[tx.to] = { address: tx.to, totalGasUsed: 0, totalGasCost: 0, transactionCount: 0 }
        }
        const gasUsed = parseInt(tx.gas, 16)
        const gasPrice = parseInt(tx.gasPrice, 16)
        const gasCost = gasUsed * gasPrice
        contractGasUsage[tx.to].totalGasUsed += gasUsed
        contractGasUsage[tx.to].totalGasCost += gasCost
        contractGasUsage[tx.to].transactionCount++
      }
    })

    const sortedContracts = Object.values(contractGasUsage)
      .sort((a, b) => b.totalGasCost - a.totalGasCost)
      .slice(0, 10)

    const contractsWithInfo: ContractInfo[] = await Promise.all(sortedContracts.map(async contract => ({
      ...contract,
      name: await getContractName(contract.address),
      averageGasUsed: contract.totalGasUsed / contract.transactionCount,
      averageGasCost: contract.totalGasCost / contract.transactionCount
    })))

    return NextResponse.json(contractsWithInfo)
  } catch (error) {
    console.error('Error fetching high gas contracts:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch high gas contracts', 
        details: error instanceof Error ? error.message : 'Unknown error',
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      },
      { status: 500 }
    )
  }
}