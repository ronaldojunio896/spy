export default function LinkInvalidPage({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-slate-100">
      <div className="text-center">
        {/* Ícone de erro */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Link Inválido</h1>
        <p className="text-slate-400 text-sm">
          {message || 'Este link não existe ou foi removido.'}
        </p>
      </div>
    </div>
  );
}
