import React, { useState, useEffect } from 'react'

interface ApiKeys {
  etherscan: string;
  openai: string;
}

interface ApiKeyInputProps {
  onApiKeysSubmit: (apiKeys: ApiKeys) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysSubmit }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    etherscan: '',
    openai: ''
  });

  useEffect(() => {
    const storedEtherscanKey = localStorage.getItem('etherscanApiKey');
    const storedOpenAIKey = localStorage.getItem('openaiApiKey');
    
    if (storedEtherscanKey || storedOpenAIKey) {
      setApiKeys({
        etherscan: storedEtherscanKey || '',
        openai: storedOpenAIKey || ''
      });
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('etherscanApiKey', apiKeys.etherscan);
    localStorage.setItem('openaiApiKey', apiKeys.openai);
    onApiKeysSubmit(apiKeys);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-4">
      <div>
        <label htmlFor="etherscan" className="block text-sm font-medium text-gray-700 mb-2">
          Etherscan API Key
        </label>
        <input
          type="text"
          id="etherscan"
          name="etherscan"
          value={apiKeys.etherscan}
          onChange={handleApiKeyChange}
          placeholder="Enter your Etherscan API key"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="openai" className="block text-sm font-medium text-gray-700 mb-2">
          OpenAI API Key
        </label>
        <input
          type="text"
          id="openai"
          name="openai"
          value={apiKeys.openai}
          onChange={handleApiKeyChange}
          placeholder="Enter your OpenAI API key"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit API Keys
      </button>
    </form>
  );
};

export default ApiKeyInput;