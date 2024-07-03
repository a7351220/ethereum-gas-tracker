import React, { useState, useEffect } from 'react'

interface ApiKeys {
  etherscan: string;
  openai: string;
}

interface ApiKeyInputProps {
  onApiKeysChange: (apiKeys: ApiKeys) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeysChange }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    etherscan: '',
    openai: ''
  });

  useEffect(() => {
    const storedEtherscanKey = localStorage.getItem('etherscanApiKey');
    const storedOpenAIKey = localStorage.getItem('openaiApiKey');
    
    if (storedEtherscanKey || storedOpenAIKey) {
      const updatedKeys = {
        etherscan: storedEtherscanKey || '',
        openai: storedOpenAIKey || ''
      };
      setApiKeys(updatedKeys);
      onApiKeysChange(updatedKeys);
    }
  }, [onApiKeysChange]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedKeys = { ...apiKeys, [name]: value };
    setApiKeys(updatedKeys);
    localStorage.setItem(`${name}ApiKey`, value);
    onApiKeysChange(updatedKeys);
  };

  return (
    <div className="mb-4 space-y-4">
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
    </div>
  );
};

export default ApiKeyInput;