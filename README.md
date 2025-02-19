# Ethereum Gas Tracker

Ethereum Gas Tracker is a web application that helps users identify and analyze high gas-consuming smart contracts on the Ethereum network. This tool is designed for developers, researchers, and cryptocurrency enthusiasts who want to stay informed about gas usage trends and potentially optimize their own smart contracts.

https://github.com/a7351220/ethereum-gas-tracker/assets/64185482/ee93ae29-360a-4282-a055-726050bc3661

## Features

- Fetch and display top gas-consuming contracts
- Analyze individual contract source code using AI
- User-friendly interface with responsive design
- Secure API key management for Etherscan and OpenAI

## How It Works

### Calculating and Filtering High Gas Contracts

The Ethereum Gas Tracker uses the following method to identify high gas-consuming contracts:

1. **Data Retrieval**: We fetch the latest block data from the Ethereum network using the Etherscan API.

2. **Gas Usage Calculation**: For each transaction in the block, we calculate the total gas cost using the formula:
   ```
   Total Gas Cost = Gas Used * Gas Price
   ```

3. **Contract Aggregation**: We aggregate the gas usage data for each unique contract address, summing up the total gas cost and counting the number of transactions.

4. **Sorting and Filtering**: The contracts are then sorted based on their total gas cost in descending order. We select the top 10 contracts with the highest total gas cost.

5. **Additional Information**: For each of these top contracts, we fetch additional information such as the contract name (if available) and calculate the average gas cost per transaction.

This method allows us to identify contracts that are consistently using large amounts of gas, which could indicate complex operations, inefficient code, or simply high usage due to popularity.

### Contract Analysis

When a user selects a specific contract for analysis:

1. We fetch the contract's source code using the Etherscan API.
2. The source code is then sent to OpenAI's GPT model for analysis.
3. The AI provides insights into the contract's main functions, potential security risks, and notable features.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Etherscan API key
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ethereum-gas-tracker.git
   cd ethereum-gas-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. When you first open the application, you'll be prompted to enter your Etherscan and OpenAI API keys. These are stored locally in your browser and are not sent to any server except when making API calls.

2. After submitting your API keys, click the "Fetch High Gas Contracts" button to retrieve the latest data.

3. You'll see a table displaying the top gas-consuming contracts. Each row shows the contract name (if available), address, total gas cost, average gas cost, and transaction count.

4. To analyze a specific contract, click the "Select" button next to it. The application will fetch the contract's source code and provide an AI-generated analysis below the table.

5. You can reset your API keys at any time using the "Reset API Keys" button.

## Security and Privacy

- API keys are stored in the browser's local storage and are only sent to their respective services (Etherscan and OpenAI) when making API calls.
- No personal data is collected or stored by this application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Etherscan](https://etherscan.io/) for providing the Ethereum blockchain data API
- [OpenAI](https://openai.com/) for the GPT model used in contract analysis
- [MetaMask](https://metamask.io/) for inspiration and support in the Ethereum ecosystem

## Disclaimer

This tool is for educational and research purposes only. Always conduct your own research and due diligence before interacting with any smart contracts or making financial decisions based on the information provided by this tool.
