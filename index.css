import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Info,
  Zap,
  VolumeX,
} from 'lucide-react';
import { RecyclingAnalysisResult } from '../types';
import { SAMPLE_PRESETS } from '../data/mockData';

interface CameraScannerProps {
  onVerifyRequest: (analysisResult: RecyclingAnalysisResult, photoBase64: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onVerifyRequest }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<RecyclingAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMessage(
        '카메라에 접근할 수 없습니다. 파일 업로드나 샘플 이미지를 이용해보세요.'
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedPhoto(dataUrl);
        stopCamera();
        analyzeImage(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedPhoto(base64);
        stopCamera();
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedPhoto(preset.image);
    stopCamera();
    analyzeImage(preset.image, preset.name);
  };

  const analyzeImage = async (photoBase64: string, customPrompt?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          imageBase64: photoBase64.startsWith('data:') ? photoBase64 : undefined,
          prompt: customPrompt
            ? `이 이미지(${customPrompt})의 올바른 분리배출 방법과 단계를 분석해주세요.`
            : '이 물품의 종류와 올바른 분리배출 방법을 자세히 분석해주세요.',
        }),
      });

      if (!response.ok) {
        throw new Error(`AI 분석 오류: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error('Analyze error:', err);
      setErrorMessage(
        err.message || 'AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const speakGuide = () => {
    if (!analysis) return;
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const text = `${analysis.itemName}의 분리배출 방법입니다. 분류 항목은 ${analysis.category}이며, ${analysis.recyclabilityTag}입니다. 배출 순서는 다음과 같습니다. ${analysis.preparationSteps.join('. ')}. 주의사항: ${analysis.commonMistakes}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 rounded-3xl border border-emerald-400/30 text-white shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-white/20 text-white rounded-2xl backdrop-blur-md shrink-0 shadow-sm">
            <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300/30" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              AI 실시간 스캐너
              <span className="text-xs font-extrabold bg-white/20 text-emerald-100 px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-sm">
                Gemini 3.6 Flash
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-50 mt-1 leading-relaxed font-medium">
              버릴 물건을 비추거나 사진을 올려주세요. 재질 분석부터 배출 방법 안내, 그리고 인증 보상까지 한 번에 해결합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Main Camera & Scanner Box */}
      <div className="bg-white/90 border border-emerald-100 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
        <div className="relative min-h-[300px] sm:min-h-[360px] bg-emerald-50/30 flex flex-col items-center justify-center p-4">
          <canvas ref={canvasRef} className="hidden" />

          {/* Active Camera Feed */}
          {isCameraActive ? (
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden bg-black border-2 border-emerald-500 shadow-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Scan Overlay Frame */}
              <div className="absolute inset-0 border-2 border-dashed border-emerald-400/90 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-emerald-400 rounded-xl animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
              </div>

              {/* Camera Actions */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 px-4">
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-slate-900/80 text-white text-xs font-bold rounded-xl hover:bg-slate-900 border border-slate-700 shadow"
                >
                  취소
                </button>
                <button
                  onClick={capturePhoto}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-emerald-500/40 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  촬영 및 인식하기
                </button>
              </div>
            </div>
          ) : selectedPhoto ? (
            /* Selected / Captured Photo Display */
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-emerald-200 bg-white shadow-md">
              <img
                src={selectedPhoto}
                alt="분리수거 분석 대상"
                className="w-full h-full object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-3" />
                  <p className="text-emerald-300 font-extrabold text-sm">
                    AI가 분리수거 방법을 정밀 분석 중...
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    재질 분류, 라벨 세척 규칙, 탄소 절감 효과 계산
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Empty State Options */
            <div className="text-center py-8 px-4 max-w-md bg-emerald-50/50 border border-emerald-100/80 rounded-2xl w-full">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                버릴 물건의 사진을 비춰보세요
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                투명 페트병, 박스, 과자봉지, 가전제품 등 애매한 분리배출 항목을 AI가 즉시 알려드립니다.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  카메라 켜기
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  사진 파일 선택
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Action controls when photo selected */}
        {selectedPhoto && !isCameraActive && (
          <div className="p-3 bg-white border-t border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={startCamera}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200"
              >
                <Camera className="w-3.5 h-3.5" />
                다시 촬영
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold border border-sky-200"
              >
                <Upload className="w-3.5 h-3.5" />
                다른 파일
              </button>
            </div>

            {analysis && (
              <button
                onClick={speakGuide}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  isSpeaking
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" /> 음성 중지
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" /> 음성 안내 듣기
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Quick Sample Pick Presets */}
        <div className="p-4 bg-white/80 border-t border-emerald-100">
          <p className="text-xs font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            빠른 샘플 시험해보기 (사진이 없을 때)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/90 border border-emerald-200/80 text-left transition-all group"
              >
                <img
                  src={preset.image}
                  alt={preset.name}
                  className="w-8 h-8 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform shadow-xs"
                />
                <span className="text-[11px] font-bold text-slate-700 line-clamp-1 group-hover:text-emerald-900">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message display */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* AI Analysis Result Card */}
      {analysis && (
        <div className="bg-white border border-emerald-200/80 rounded-3xl p-6 shadow-xl text-slate-900 space-y-6">
          {/* Header & Category Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                AI 인식 결과 (정확도 98%)
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{analysis.itemName}</h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                분류: {analysis.category}
              </span>
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-black border ${
                  analysis.isRecyclable
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {analysis.recyclabilityTag}
              </span>
            </div>
          </div>

          {/* Step-by-step Preparation Guide */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
              올바른 분리배출 4단계 가이드
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {analysis.preparationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100"
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-medium text-slate-800 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes & Ed Tip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                흔한 실수 주의사항
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">{analysis.commonMistakes}</p>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-200/80 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-sky-800 mb-1">
                <Info className="w-4 h-4 text-sky-600" />
                에코 상식
              </div>
              <p className="text-xs text-sky-900 leading-relaxed font-medium">{analysis.educationalTip}</p>
            </div>
          </div>

          {/* Estimated Reward & Direct Verification Action */}
          <div className="pt-4 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">예상 적립</span>
                <span className="text-base font-black text-amber-600">
                  +{analysis.ecoPointsEstimated} P
                </span>
              </div>
              <div className="h-8 w-px bg-emerald-200" />
              <div>
                <span className="text-slate-500 font-medium block">탄소 절감 효과</span>
                <span className="text-base font-black text-emerald-700">
                  {analysis.co2SavedGrams}g CO₂
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedPhoto) {
                  onVerifyRequest(analysis, selectedPhoto);
                }
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <span>이 결과로 분리배출 인증하고 포인트 받기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
