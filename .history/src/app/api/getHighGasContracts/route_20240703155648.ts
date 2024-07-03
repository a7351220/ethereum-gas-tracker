import { NextResponse } from 'next/server'
import axios from 'axios'

interface Transaction {
  from: string
  to: string
  gasUsed: string
}

interface Contract {
  address: string
  gasUsed: string
}

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

if (!ETHERSCAN_API_KEY) {
  console.error('ETHERSCAN_API_KEY is not set in the environment variables')
}

export async function GET() {
  try {
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

    // 按 gasUsed 排序交易并获取前 5 个
    const sortedTransactions = transactions
      .sort((a, b) => parseInt(b.gasUsed, 16) - parseInt(a.gasUsed, 16))
      .slice(0, 5)

    // 转换交易为合约格式
    const highGasContracts: Contract[] = sortedTransactions.map(tx => ({
      address: tx.to,
      gasUsed: parseInt(tx.gasUsed, 16).toString()
    }))

    return NextResponse.json(highGasContracts)
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