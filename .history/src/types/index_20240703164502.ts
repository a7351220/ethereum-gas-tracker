export interface Contract {
  address: string
  name: string
  totalGasUsed: number
  totalGasCost: number
  transactionCount: number
  averageGasUsed: number
  averageGasCost: number
}
export interface ContractAnalysis {
  address: string
  analysis: string
}
