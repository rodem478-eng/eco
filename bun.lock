import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Sparkles,
  Send,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const GuideBot: React.FC = () => {
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLogs, setChatLogs] = useState<
    { sender: 'user' | 'bot'; message: string }[]
  >([
    {
      sender: 'bot',
      message:
        '안녕하세요! 에코 가이드봇입니다. 분리수거하기 애매하거나 궁금한 물품이 있다면 무엇이든 물어보세요! 예: "스포이트 병 버리는 법", "영수증은 종이인가요?"',
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const quickQuestions = [
    '아이스팩 버리는 방법',
    '기름때 묻은 피자상자',
    '깨진 유리그릇 배출',
    '스프링 노트 분리수거',
    '영수증 / 종이컵 배출',
    '보조배터리 / 폐건전지',
  ];

  const quickSearchMatrix = [
    {
      item: '영수증 (감열지)',
      category: '일반쓰레기',
      tip: '약품 처리된 종이 및 합성재질로 재활용 불가능합니다.',
    },
    {
      item: '깨끗한 과자/라면 봉지',
      category: '비닐류',
      tip: '딱지로 접지 말고 펼쳐서 비닐류 전용함으로 배출합니다.',
    },
    {
      item: '투명 생수 페트병',
      category: '투명페트병',
      tip: '비닐 라벨을 떼고 깨끗이 헹군 후 압착하여 배출합니다.',
    },
    {
      item: '깨진 유리 조각',
      category: '일반쓰레기',
      tip: '신문지에 여러 번 싸서 종량제 봉투 또는 불연성 마대에 배출합니다.',
    },
    {
      item: '우유팩 / 음료팩',
      category: '종이팩 전용함',
      tip: '일반 종이 박스와 섞이지 않게 씻고 펴서 종이팩 수거함으로 배출합니다.',
    },
    {
      item: '보조배터리 / 휴대폰',
      category: '폐가전 / 건전지함',
      tip: '폭발 및 중금속 위험이 있어 아파트/주민센터 전용함으로 배출합니다.',
    },
  ];

  const handleSendChat = async (messageText?: string) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim()) return;

    const newLogs = [
      ...chatLogs,
      { sender: 'user' as const, message: textToSend },
    ];
    setChatLogs(newLogs);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: textToSend,
        }),
      });

      if (!response.ok) {
        throw new Error('응답 실패');
      }

      const data = await response.json();
      setChatLogs((prev) => [
        ...prev,
        {
          sender: 'bot',
          message:
            data.answer ||
            '분리배출 가이드를 찾을 수 없습니다. 다시 질문해주세요.',
        },
      ]);
    } catch (err) {
      setChatLogs((prev) => [
        ...prev,
        {
          sender: 'bot',
          message:
            '죄송합니다. 네트워크 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMatrix = quickSearchMatrix.filter(
    (item) =>
      item.item.includes(searchQuery) ||
      item.category.includes(searchQuery) ||
      item.tip.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 border border-emerald-400/30 rounded-3xl p-6 text-white shadow-lg">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-yellow-300" />
          분리수거 Q&A AI 가이드봇
        </h2>
        <p className="text-xs sm:text-sm text-emerald-50 mt-1 font-medium leading-relaxed">
          애매한 분리배출 방법이나 궁금한 품목을 검색하거나 AI 가이드봇에게 질문해보세요.
        </p>
      </div>

      {/* Grid Layout: Left AI Chat, Right Quick Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: AI Chat Box */}
        <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-xl flex flex-col justify-between h-[500px]">
          {/* Chat Messages Log */}
          <div className="overflow-y-auto space-y-3 p-1 pr-2 text-xs flex-1">
            {chatLogs.map((log, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  log.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed font-medium ${
                    log.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                      : 'bg-emerald-50/80 text-slate-800 border border-emerald-100 rounded-bl-none shadow-xs'
                  }`}
                >
                  {log.message}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
                <span>AI가 올바른 분리배출 답안을 작성 중입니다...</span>
              </div>
            )}
          </div>

          {/* Quick Tag Pills */}
          <div className="pt-3 border-t border-emerald-100">
            <p className="text-[11px] text-slate-500 mb-2 font-bold">자주 묻는 질문</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(q)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-200/80 transition-colors shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="예: 샴푸 용기 분리수거 방법"
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-900 text-xs rounded-2xl px-3.5 py-2.5 outline-none font-medium transition-colors shadow-inner"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold rounded-2xl shrink-0 shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Quick Search Matrix */}
        <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-xl flex flex-col h-[500px]">
          <div className="pb-3 border-b border-emerald-100 space-y-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              자주 헷갈리는 품목 요약 사전
            </h3>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="품목명 검색 (예: 영수증, 유리)"
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-900 rounded-2xl pl-9 pr-3.5 py-2 text-xs font-medium outline-none transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="overflow-y-auto space-y-2.5 pt-3 flex-1 pr-1">
            {filteredMatrix.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-1 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">{item.item}</span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
