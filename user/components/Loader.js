export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-amber-700 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-500 text-sm font-medium">{text}</p>
    </div>
  );
}
