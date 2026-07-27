export type WasteCategory =
  | '투명페트병'
  | '플라스틱'
  | '비닐류'
  | '종이/박스'
  | '종이팩'
  | '캔/고철'
  | '유리병'
  | '일반쓰레기'
  | '음식물'
  | '폐가전/건전지';

export interface RecyclingAnalysisResult {
  itemName: string;
  category: WasteCategory;
  categoryColor: string;
  isRecyclable: boolean;
  recyclabilityTag: string;
  preparationSteps: string[];
  commonMistakes: string;
  ecoPointsEstimated: number;
  co2SavedGrams: number;
  educationalTip: string;
}

export interface VerificationResult {
  approved: boolean;
  score: number;
  ecoPointsEarned: number;
  feedbackMessage: string;
  improvementSuggestion?: string;
  impact: {
    co2SavedKg: number;
    waterSavedLiters: number;
  };
}

export interface UserEcoProfile {
  points: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  totalVerifiedCount: number;
  totalCo2SavedKg: number;
  totalTreesSaved: number;
  badges: Badge[];
  history: VerificationHistory[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface VerificationHistory {
  id: string;
  timestamp: string;
  itemName: string;
  category: WasteCategory;
  pointsEarned: number;
  photoUrl: string;
  verified: boolean;
  feedback: string;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'coupon' | 'product' | 'donation';
  pointsCost: number;
  image: string;
  description: string;
  provider: string;
}

export interface GameWasteItem {
  id: string;
  name: string;
  iconName: string;
  correctCategory: WasteCategory;
  description: string;
  tip: string;
  isTricky: boolean;
}

export interface GameState {
  score: number;
  highScore: number;
  timeLeft: number;
  combo: number;
  maxCombo: number;
  lives: number;
  correctCount: number;
  wrongCount: number;
  isPlaying: boolean;
  isGameOver: boolean;
}
