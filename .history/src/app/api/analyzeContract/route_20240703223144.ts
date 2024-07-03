import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  const { address, etherscanApiKey, openaiApiKey } = await request.json()

  if (!address) {
    return NextResponse.json({ error: 'Contract address is required' }, { status: 400 })
  }

  if (!etherscanApiKey) {
    return NextResponse.json({ error: 'Etherscan API key is required' }, { status: 400 })
  }

  if (!openaiApiKey) {
    return NextResponse.json({ error: 'OpenAI API key is required' }, { status: 400 })
  }

  try {
    const etherscanResponse = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: etherscanApiKey
      }
    })

    if (etherscanResponse.data.status !== '1') {
      throw new Error(`Etherscan API error: ${etherscanResponse.data.message}`)
    }

    const contractCode = etherscanResponse.data.result[0].SourceCode

    if (!contractCode) {
      return NextResponse.json({ error: 'Contract source code not available' }, { status: 404 })
    }

    // 使用 OpenAI API 分析合约
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content: "You are an expert in Ethereum smart contracts. Analyze the given contract code and provide a brief summary of its main functions, potential security risks, and any notable features."
          },
          {
            role: "user",
            content: `Analyze this Ethereum contract:\n\n${contractCode}`
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const analysis = openaiResponse.data.choices[0].message.content.trim()
    return NextResponse.json({ address, analysis })
  } catch (error) {
    console.error('Error analyzing contract:', error)
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: `API request failed: ${error.message}` }, { status: error.response?.status || 500 })
    }
    return NextResponse.json({ error: 'Failed to analyze contract' }, { status: 500 })
  }
}