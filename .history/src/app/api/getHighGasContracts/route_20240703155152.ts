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
    '[data-selector="txnGasUsage"] tbody tr'
  ]

  for (const selector of selectors) {
    $(selector).each((index, element) => {
      if (index >= 5) return false // 只获取前5个合约

      const address = $(element).find('td:nth-child(2) a').text().trim()
      const gasUsed = $(element).find('td:nth-child(3)').text().trim()

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
      throw new Error('No contracts found. The page structure might have changed.')
    }

    return NextResponse.json(highGasContracts)
  } catch (error) {
    console.error('Error fetching high gas contracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch high gas contracts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}