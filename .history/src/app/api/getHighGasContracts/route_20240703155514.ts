import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<string> {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return fetchWithRetry(url, retries - 1)
    }
    throw error
  }
}

interface Contract {
  address: string
  gasUsed: string
}

async function parseHighGasContracts(html: string): Promise<Contract[]> {
  const $ = cheerio.load(html)
  const contracts: Contract[] = []

  // 尝试不同的选择器，以应对可能的结构变化
  const selectors = [
    '#tblResult2 tbody tr',
    '.table-responsive tbody tr',
    '[data-selector="txnGasUsage"] tbody tr',
    'table tbody tr' // 更通用的选择器
  ]

  for (const selector of selectors) {
    $(selector).each((index, element) => {
      if (index >= 5) return false // 只获取前5个合约

      const cells = $(element).find('td')
      if (cells.length < 3) return // 确保行有足够的单元格

      const address = $(cells[1]).find('a').text().trim()
      const gasUsed = $(cells[2]).text().trim()

      if (address && gasUsed) {
        contracts.push({ address, gasUsed })
      }
    })

    if (contracts.length > 0) break // 如果找到了合约，就停止尝试其他选择器
  }

  return contracts
}

export async function GET() {
  try {
    const html = await fetchWithRetry('https://etherscan.io/gastracker')
    const highGasContracts = await parseHighGasContracts(html)

    if (highGasContracts.length === 0) {
      // 如果没有找到合约，记录页面结构以进行调试
      const $ = cheerio.load(html)
      const pageStructure = $('body').html()
      console.error('Page structure:', pageStructure)
      throw new Error('No contracts found. The page structure might have changed.')
    }

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