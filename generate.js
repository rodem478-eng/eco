import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini SDK with server-side environment variable
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다. Vercel 환경 변수(Environment Variables)에서 GEMINI_API_KEY를 설정해 주세요.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function handleGenerateRequest(reqBody: any) {
  const { action, imageBase64, mimeType = "image/jpeg", prompt, category } = reqBody || {};

  if (action === "analyze") {
    const ai = getGeminiClient();
    // 1. AI 카메라 분리수거 분석
    const systemPrompt = `
당신은 대한민국 환경부 공식 분리배출 가이드라인에 완벽히 통달한 '분리수거 AI 전문가'입니다.
업로드된 쓰레기/재활용품 이미지 또는 제품 이름을 분석하여 정확한 분리배출 방법과 가이드라인을 작성해주세요.

[필수 분석 항목]
1. itemName: 품목명 (예: 투명 생수 페트병 500ml, 기름때 묻은 피자박스 등)
2. category: '투명페트병' | '플라스틱' | '비닐류' | '종이/박스' | '종이팩' | '캔/고철' | '유리병' | '일반쓰레기' | '음식물' | '폐가전/건전지' 중 하나
3. categoryColor: 카테고리에 어울리는 색상명 (emerald, blue, purple, amber, teal, orange, cyan, rose, lime, gray)
4. isRecyclable: boolean (재활용 가능한지 여부)
5. recyclabilityTag: 짧은 배출 상태 태그 (예: '재활용 가능', '조건부 재활용', '일반쓰레기 배출', '지자체 전용수거함')
6. preparationSteps: 3~4단계의 명확한 세척/분리배출 순서 목록 (예: ['내용물 비우기', '물로 깨끗이 헹구기', '비닐 라벨 제거 후 비닐류 배출', '페트병 압착 후 뚜껑 닫기'])
7. commonMistakes: 시민들이 자주 실수하는 분리배출 팁 (예: '라벨이나 스티커를 떼지 않고 버리면 전량 일반쓰레기로 폐기됩니다.')
8. ecoPointsEstimated: 실천시 예상 적립 포인트 (30 ~ 100)
9. co2SavedGrams: 배출 실천 시 줄이는 탄소 배출량(g)
10. educationalTip: 자원순환 관련 유익하고 흥미로운 상식 한 줄
`;

    const contents: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    contents.push({
      text: prompt || "이 물품의 올바른 분리배출 방법을 자세하고 명확하게 분석하여 JSON으로 알려주세요.",
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: contents },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING },
            category: { type: Type.STRING },
            categoryColor: { type: Type.STRING },
            isRecyclable: { type: Type.BOOLEAN },
            recyclabilityTag: { type: Type.STRING },
            preparationSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            commonMistakes: { type: Type.STRING },
            ecoPointsEstimated: { type: Type.NUMBER },
            co2SavedGrams: { type: Type.NUMBER },
            educationalTip: { type: Type.STRING },
          },
          required: [
            "itemName",
            "category",
            "isRecyclable",
            "recyclabilityTag",
            "preparationSteps",
            "commonMistakes",
            "ecoPointsEstimated",
            "co2SavedGrams",
            "educationalTip",
          ],
        },
      },
    });

    const resultText = response.text || "{}";
    return JSON.parse(resultText);
  } else if (action === "verify") {
    const ai = getGeminiClient();
    // 2. 분리수거 인증 사진 검증
    const systemPrompt = `
당신은 분리배출 인증샷을 엄격하지만 칭찬과 함께 평가하는 '에코 검증관'입니다.
사용자가 제출한 분리배출 실천 사진이 제대로 세척, 라벨 제거, 압착/분리가 되었는지 판별하세요.

[검증 기준]
- 라벨/스티커 제거 여부
- 오염물/음식물 세척 여부
- 분류에 맞는 정돈 상태
- 올바른 분리수거 준비 여부

[반환 항목]
- approved: boolean (올바른 분리배출 실천 인증 성공 여부)
- score: 0~100 점수
- ecoPointsEarned: 승인시 50~100 포인트, 미승인시 0
- feedbackMessage: 칭찬 또는 이유가 담긴 친절한 검증 메시지
- improvementSuggestion: 더 완벽한 배출을 위한 꿀팁 (선택)
- impact: { co2SavedKg: number (예: 0.12), waterSavedLiters: number (예: 1.5) }
`;

    const contents: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    contents.push({
      text: `선택한 카테고리: ${category || "분리배출"}. 사진 속 분리배출 실천 상태를 검증해주세요.`,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: contents },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            approved: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER },
            ecoPointsEarned: { type: Type.NUMBER },
            feedbackMessage: { type: Type.STRING },
            improvementSuggestion: { type: Type.STRING },
            impact: {
              type: Type.OBJECT,
              properties: {
                co2SavedKg: { type: Type.NUMBER },
                waterSavedLiters: { type: Type.NUMBER },
              },
              required: ["co2SavedKg", "waterSavedLiters"],
            },
          },
          required: ["approved", "score", "ecoPointsEarned", "feedbackMessage", "impact"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } else if (action === "chat") {
    const ai = getGeminiClient();
    // 3. 분리수거 Q&A 챗봇
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "당신은 대한민국 분리배출 친절 가이드봇입니다. 사용자의 질문에 맞춰 명쾌하고 따라하기 쉬운 분리배출 솔루션을 2~3문장과 핵심 요약 표로 친절하게 설명해주세요.",
      },
    });

    return { answer: response.text };
  } else {
    // General / Telemetry / Health Check fallback to avoid 404
    return { status: "ok", service: "GreenScan API", mock: true };
  }
}

// Default export for Vercel Serverless Function pattern
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ status: "ok", service: "GreenScan API" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const result = await handleGenerateRequest(body);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || "서버 오류가 발생했습니다." });
  }
}
