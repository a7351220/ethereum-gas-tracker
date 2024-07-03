'use client'

type ErrorModalProps = {
  error: string;
};

export default function ErrorModal({ error }: ErrorModalProps) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 shadow-md" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );
}
