import { NextResponse } from 'next/server'
import axios from 'axios'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

if (!ETHERSCAN_API_KEY) {
  console.error('ETHERSCAN_API_KEY is not set in the environment variables')
}

interface Transaction {
  to: string
  from: string
  gasUsed: string
  gasPrice: string
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
        module: 'proxy',
        action: 'eth_getBlockByNumber',
        tag: 'latest',
        boolean: 'true',
        apikey: ETHERSCAN_API_KEY
      }
    })

    if (response.data.error) {
      throw new Error(`Etherscan API error: ${response.data.error.message}`)
    }

    const transactions: Transaction[] = response.data.result.transactions

    // 计算每个合约的 GAS 使用情况
    const contractGasUsage: Record<string, ContractGasUsage> = {}
    transactions.forEach(tx => {
      if (tx.to) {
        if (!contractGasUsage[tx.to]) {
          contractGasUsage[tx.to] = { address: tx.to, totalGasUsed: 0, transactionCount: 0 }
        }
        contractGasUsage[tx.to].totalGasUsed += parseInt(tx.gasUsed, 16) * parseInt(tx.gasPrice, 16)
        contractGasUsage[tx.to].transactionCount++
      }
    })

    // 转换为数组并排序
    const sortedContracts = Object.values(contractGasUsage)
      .sort((a, b) => b.totalGasUsed - a.totalGasUsed)
      .slice(0, 10)  // 获取前 10 个高 GAS 消耗的合约

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
        details: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: process.env.NODE_ENV === 'development' ? {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        } : undefined
      },
      { status: 500 }
    )
  }
}