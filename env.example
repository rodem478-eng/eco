import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Upload,
  ShoppingBag,
  History,
  Trees,
  ShieldCheck,
  Zap,
  Gift,
  ArrowUpRight,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserEcoProfile, VerificationResult, RecyclingAnalysisResult } from '../types';
import { REWARD_ITEMS } from '../data/mockData';

interface RewardSectionProps {
  userProfile: UserEcoProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserEcoProfile>>;
  prefilledAnalysis?: RecyclingAnalysisResult | null;
  prefilledPhotoUrl?: string | null;
}

export const RewardSection: React.FC<RewardSectionProps> = ({
  userProfile,
  setUserProfile,
  prefilledAnalysis,
  prefilledPhotoUrl,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'verify' | 'shop' | 'badges' | 'history'>(
    prefilledPhotoUrl ? 'verify' : 'verify'
  );

  const [verifyPhoto, setVerifyPhoto] = useState<string | null>(prefilledPhotoUrl || null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    prefilledAnalysis ? prefilledAnalysis.category : '투명페트병'
  );
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);

  const categoriesList = [
    '투명페트병',
    '플라스틱',
    '비닐류',
    '종이/박스',
    '종이팩',
    '캔/고철',
    '유리병',
    '일반쓰레기',
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setVerifyPhoto(event.target?.result as string);
        setVerificationResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeVerification = async () => {
    if (!verifyPhoto) return;

    setIsVerifying(true);
    setVerifyError(null);
    setVerificationResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          imageBase64: verifyPhoto,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        throw new Error('인증 검증 처리 중 오류가 발생했습니다.');
      }

      const result: VerificationResult = await response.json();
      setVerificationResult(result);

      if (result.approved && result.ecoPointsEarned > 0) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Update User Eco Profile
        setUserProfile((prev) => {
          const newPoints = prev.points + result.ecoPointsEarned;
          const newVerifiedCount = prev.totalVerifiedCount + 1;
          const newCo2 = +(prev.totalCo2SavedKg + result.impact.co2SavedKg).toFixed(2);
          const newTrees = +(newCo2 / 10).toFixed(1);

          const newHistory = [
            {
              id: Date.now().toString(),
              timestamp: new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              itemName: prefilledAnalysis?.itemName || `${selectedCategory} 올바른 분리배출`,
              category: selectedCategory as any,
              pointsEarned: result.ecoPointsEarned,
              photoUrl: verifyPhoto,
              verified: true,
              feedback: result.feedbackMessage,
            },
            ...prev.history,
          ];

          return {
            ...prev,
            points: newPoints,
            totalVerifiedCount: newVerifiedCount,
            totalCo2SavedKg: newCo2,
            totalTreesSaved: newTrees,
            history: newHistory,
          };
        });
      }
    } catch (err: any) {
      console.error('Verify error:', err);
      setVerifyError(err.message || '인증 검증 중 서버 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRedeem = (reward: (typeof REWARD_ITEMS)[0]) => {
    if (userProfile.points < reward.pointsCost) {
      alert(
        `포인트가 부족합니다. (필요: ${reward.pointsCost.toLocaleString()}P, 현재: ${userProfile.points.toLocaleString()}P)`
      );
      return;
    }

    setUserProfile((prev) => ({
      ...prev,
      points: prev.points - reward.pointsCost,
    }));

    setRedeemSuccessMsg(
      `'${reward.title}' 교환이 성공적으로 완료되었습니다! 쿠폰함 및 마일리지 사용 내역을 확인해 주세요.`
    );
    setTimeout(() => setRedeemSuccessMsg(null), 5000);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Eco Impact Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 border border-amber-300 flex items-center justify-center text-slate-950 shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 fill-amber-950/20" />
          </div>
          <div>
            <span className="text-[11px] text-amber-800 font-bold block">에코 마일리지</span>
            <span className="text-xl font-black text-amber-900">
              {userProfile.points.toLocaleString()} P
            </span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 border border-emerald-400 flex items-center justify-center text-white shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-emerald-800 font-bold block">누적 인증 횟수</span>
            <span className="text-xl font-black text-emerald-950">
              {userProfile.totalVerifiedCount} 회
            </span>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200/80 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500 border border-sky-400 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-sky-800 font-bold block">CO₂ 절감량</span>
            <span className="text-xl font-black text-sky-950">
              {userProfile.totalCo2SavedKg} kg
            </span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200/80 rounded-3xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-500 border border-green-400 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-green-800 font-bold block">나무 환산 효과</span>
            <span className="text-xl font-black text-green-950">
              {userProfile.totalTreesSaved} 그루
            </span>
          </div>
        </div>
      </div>

      {/* Reward System Navigation Tabs */}
      <div className="flex border-b border-emerald-100 gap-2 text-sm font-bold">
        <button
          onClick={() => setActiveSubTab('verify')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all ${
            activeSubTab === 'verify'
              ? 'border-emerald-600 text-emerald-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>분리수거 인증</span>
        </button>

        <button
          onClick={() => setActiveSubTab('shop')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all ${
            activeSubTab === 'shop'
              ? 'border-emerald-600 text-emerald-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>리워드 에코 샵</span>
        </button>

        <button
          onClick={() => setActiveSubTab('badges')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all ${
            activeSubTab === 'badges'
              ? 'border-emerald-600 text-emerald-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>뱃지 & 등급</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all ${
            activeSubTab === 'history'
              ? 'border-emerald-600 text-emerald-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>인증 내역 ({userProfile.history.length})</span>
        </button>
      </div>

      {/* Success Notification message */}
      {redeemSuccessMsg && (
        <div className="p-4 bg-emerald-500 border border-emerald-600 text-white rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <p>{redeemSuccessMsg}</p>
        </div>
      )}

      {/* SUB-TAB 1: Verification Form */}
      {activeSubTab === 'verify' && (
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              분리배출 실천 인증사진 제출
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              깨끗하게 세척하거나 라벨을 제거한 분리수거 준비 상태의 사진을 올려주시면 AI 검증관이 포인트를 적립해 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  분리수거 품목 카테고리
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  인증 사진 등록
                </label>
                <div className="relative aspect-[4/3] rounded-2xl bg-emerald-50/40 border-2 border-dashed border-emerald-200 hover:border-emerald-400 overflow-hidden flex flex-col items-center justify-center p-4 transition-colors">
                  {verifyPhoto ? (
                    <div className="relative w-full h-full">
                      <img
                        src={verifyPhoto}
                        alt="인증사진"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        onClick={() => setVerifyPhoto(null)}
                        className="absolute top-2 right-2 px-3 py-1 bg-slate-900/80 text-white text-xs font-bold rounded-lg backdrop-blur-sm"
                      >
                        사진 변경
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-center p-4 w-full h-full flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-emerald-500 mb-2" />
                      <span className="text-xs font-extrabold text-slate-700">
                        클릭하여 인증 사진 업로드
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">
                        라벨 제거/세척이 완료된 사진
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                disabled={!verifyPhoto || isVerifying}
                onClick={executeVerification}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI 검증관이 인증샷 정밀 평가 중...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>AI 분리수거 검증 받고 포인트 신청</span>
                  </>
                )}
              </button>

              {verifyError && (
                <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
                  {verifyError}
                </p>
              )}
            </div>

            {/* Verification Result Feedback */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col justify-between">
              {verificationResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <span className="text-xs font-bold text-slate-600">인증 판정 결과</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        verificationResult.approved
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-rose-500 text-white shadow-xs'
                      }`}
                    >
                      {verificationResult.approved ? '인증 성공 🎉' : '검토 필요'}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-4xl font-black text-amber-600">
                      +{verificationResult.ecoPointsEarned} P
                    </span>
                    <span className="text-xs text-slate-500 font-bold block mt-1">
                      실천 점수: {verificationResult.score}점
                    </span>
                  </div>

                  <div className="p-3.5 bg-white border border-emerald-100 rounded-xl text-xs leading-relaxed text-slate-800 shadow-xs">
                    <p className="font-bold text-emerald-700 mb-1">검증 피드백</p>
                    <p>{verificationResult.feedbackMessage}</p>
                  </div>

                  {verificationResult.improvementSuggestion && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                      <p className="font-bold text-amber-800 mb-0.5">에코 꿀팁</p>
                      <p>{verificationResult.improvementSuggestion}</p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-around text-xs font-bold text-slate-600">
                    <span>줄인 CO₂: {verificationResult.impact.co2SavedKg}kg</span>
                    <span>아낀 물: {verificationResult.impact.waterSavedLiters}L</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 my-auto">
                  <ShieldCheck className="w-12 h-12 mx-auto text-emerald-300 mb-3" />
                  <p className="text-sm font-bold text-slate-700">
                    인증 사진을 업로드하고 버튼을 누르면
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    AI가 분리배출 정돈 상태를 실시간 검증합니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Eco Shop */}
      {activeSubTab === 'shop' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-600" />
              에코 마일리지 교환 샵
            </h3>
            <span className="text-xs font-extrabold text-orange-700 bg-orange-100 px-3.5 py-1 rounded-full border border-orange-200 shadow-xs">
              보유 마일리지: {userProfile.points.toLocaleString()} P
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {REWARD_ITEMS.map((item) => {
              const canAfford = userProfile.points >= item.pointsCost;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-emerald-100 hover:border-emerald-300 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-[10px] font-black text-white shadow-xs">
                        {item.provider}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h4 className="font-black text-sm text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between mt-2">
                    <span className="font-black text-orange-600 text-sm">
                      {item.pointsCost.toLocaleString()} P
                    </span>

                    <button
                      disabled={!canAfford}
                      onClick={() => handleRedeem(item)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md shadow-amber-400/20 active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      {canAfford ? '교환하기' : '포인트 부족'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Badges */}
      {activeSubTab === 'badges' && (
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            에코 등급 & 업적 뱃지
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {userProfile.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  badge.isUnlocked
                    ? 'bg-white border-emerald-200 text-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    {badge.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{badge.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{badge.description}</p>
                    {badge.isUnlocked && (
                      <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                        획득일: {badge.unlockedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: History */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            분리수거 인증 히스토리
          </h3>

          {userProfile.history.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-emerald-100 shadow-sm">
              <p className="text-sm font-bold text-slate-600">
                아직 완료된 분리수거 인증 내역이 없습니다.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                첫 인증을 완료하고 에코 마일리지를 받아보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userProfile.history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.photoUrl}
                      alt={item.itemName}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-emerald-100 shadow-xs"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {item.itemName}
                      </h4>
                      <p className="text-[11px] text-slate-400">{item.timestamp}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.feedback}</p>
                    </div>
                  </div>

                  <span className="font-black text-orange-600 text-sm shrink-0">
                    +{item.pointsEarned} P
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
