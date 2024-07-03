import { NextResponse } from 'next/server'
import axios from 'axios'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

if (!ETHERSCAN_API_KEY) {
  console.error('ETHERSCAN_API_KEY is not set in the environment variables')
}

interface Transaction {
  to: string
  from: string
  gas: string
  gasPrice: string
  gasUsed: string
}

interface ContractGasUsage {
  address: string
  totalGasUsed: number
  transactionCount: number
}

export async function GET() {
  try {
    // 获取最近的 10000 个交易
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'txlist',
        address: 'null', // 使用 null 可以获取所有交易
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: ETHERSCAN_API_KEY
      }
    })

    if (response.data.status !== '1') {
      throw new Error(`Etherscan API error: ${response.data.message}`)
    }

    const transactions: Transaction[] = response.data.result

    // 计算每个合约的 gas 使用情况
    const contractGasUsage: Record<string, ContractGasUsage> = {}
    transactions.forEach(tx => {
      if (tx.to) {
        if (!contractGasUsage[tx.to]) {
          contractGasUsage[tx.to] = { address: tx.to, totalGasUsed: 0, transactionCount: 0 }
        }
        const gasUsed = parseInt(tx.gasUsed) * parseInt(tx.gasPrice)
        contractGasUsage[tx.to].totalGasUsed += gasUsed
        contractGasUsage[tx.to].transactionCount++
      }
    })

    // 转换为数组并排序
    const sortedContracts = Object.values(contractGasUsage)
      .sort((a, b) => b.totalGasUsed - a.totalGasUsed)
      .slice(0, 10)  // 获取前 10 个高 gas 消耗的合约

    // 获取合约的额外信息（如合约名称，如果可用）
    const contractsWithInfo = await Promise.all(sortedContracts.map(async contract => {
      try {
        const contractInfoResponse = await axios.get('https://api.etherscan.io/api', {
          params: {
            module: 'contract',
            action: 'getsourcecode',
            address: contract.address,
            apikey: ETHERSCAN_API_KEY
          }
        })
        const contractName = contractInfoResponse.data.result[0].ContractName || 'Unknown'
        return {
          ...contract,
          name: contractName,
          averageGasUsed: contract.totalGasUsed / contract.transactionCount
        }
      } catch (error) {
        console.error(`Error fetching info for contract ${contract.address}:`, error)
        return contract
      }
    }))

    return NextResponse.json(contractsWithInfo)
  } catch (error) {
    console.error('Error fetching high gas contracts:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch high gas contracts', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}