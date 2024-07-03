export interface Contract {
  address: string;
  name: string;
  totalGasUsed: number;
  transactionCount: number;
  averageGasUsed: number;
}

export interface ContractAnalysis {
  address: string
  analysis: string
}
