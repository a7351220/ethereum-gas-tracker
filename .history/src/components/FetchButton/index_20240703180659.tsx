'use client'

type FetchButtonProps = {
  isLoading: boolean;
  fetchHighGasContracts: () => void;
};

export default function FetchButton({ isLoading, fetchHighGasContracts }: FetchButtonProps) {
  return (
    <button 
      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={fetchHighGasContracts}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Get High Gas Contracts'}
    </button>
  );
}
