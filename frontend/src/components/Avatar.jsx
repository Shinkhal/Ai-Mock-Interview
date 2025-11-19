export default function Avatar({ speaking }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48"> {/* bigger avatar */}
        <img 
          src="/avatar2.png"
          className={`w-full h-full object-cover rounded-full border-4 border-purple-500 shadow-2xl transition
            ${speaking ? "scale-110" : "scale-100"}`}
        />

        {/* mouth animation */}
        {speaking && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-12 h-4 bg-red-400 rounded-full animate-pulse"></div>
        )}
      </div>

      <p className="text-xl font-semibold mt-4 text-gray-700">AI Interviewer</p>
    </div>
  );
}
