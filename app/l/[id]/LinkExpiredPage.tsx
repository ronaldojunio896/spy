export default function LinkExpiredPage() {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-slate-100">
      <div className="text-center">
        {/* Ícone de expirado */}
        <div className="w-20 h-20 mx-auto mb-6 bg-amber-500/10 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Link Expirado</h1>
        <p className="text-slate-400 text-sm">
          Este link expirou e não está mais disponível.
        </p>
      </div>
    </div>
  );
}
