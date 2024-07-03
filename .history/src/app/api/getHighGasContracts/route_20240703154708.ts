import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  try {
    const response = await axios.get('https://etherscan.io/gastracker')
    // 这里需要解析 HTML 来获取高 gas 合约。
    // 由于 Etherscan 的 HTML 结构可能会变化，这里只是一个示例。
    // 实际使用时，你可能需要使用像 cheerio 这样的库来解析 HTML。
    const highGasContracts = [
      { address: '0x123...', gasUsed: '1000000' },
      { address: '0x456...', gasUsed: '900000' },
      // ... 其他合约
    ]
    return NextResponse.json(highGasContracts.slice(0, 5))
  } catch (error) {
    console.error('Error fetching high gas contracts:', error)
    return NextResponse.json({ error: 'Failed to fetch high gas contracts' }, { status: 500 })
  }
}
