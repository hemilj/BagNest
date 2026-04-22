export default function ReviewCard({ review }) {
  const stars = Math.round(review.rating);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {review.userName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">{review.userName}</p>
          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto text-yellow-400">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
}
