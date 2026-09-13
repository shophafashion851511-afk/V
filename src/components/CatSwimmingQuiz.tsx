import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  Award, 
  Check, 
  Share2,
  Heart
} from 'lucide-react';
import { catAudio } from '../utils/audio';

interface Question {
  question: string;
  options: Array<{
    text: string;
    points: number;
    icon: string;
  }>;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    question: 'Khi bạn mở vòi nước rửa bát hoặc bồn rửa mặt, Boss nhà bạn phản ứng thế nào?',
    options: [
      { text: 'Chạy ngay tới, thò chân vào hứng nước hoặc liếm dòng nước chảy', points: 3, icon: '🚰' },
      { text: 'Ngồi từ xa nhìn chăm chú tò mò nhưng không đụng vào', points: 2, icon: '👀' },
      { text: 'Hoảng sợ chạy giật lùi trốn dưới gầm giường', points: 0, icon: '🏃‍♂️' },
    ]
  },
  {
    question: 'Nếu vô tình một giọt nước rơi trúng lưng bé mèo:',
    options: [
      { text: 'Bé bình thản, tiếp tục chơi như không có gì xảy ra', points: 3, icon: '😎' },
      { text: 'Rùng mình lắc lắc người rồi liếm láp lông một lúc', points: 2, icon: '👅' },
      { text: 'Nhảy dựng lên 2 mét như thể vừa chạm phải dòng điện cao thế!', points: 0, icon: '⚡' },
    ]
  },
  {
    question: 'Mỗi khi tới ngày tắm cho Boss, khung cảnh nhà tắm ra sao?',
    options: [
      { text: 'Boss tự nhảy vào bồn ngâm chân, thích thú tận hưởng mát mẻ', points: 3, icon: '🛁' },
      { text: 'Kêu meo meo nhẹ nhưng ngoan ngoãn đứng yên cho tắm', points: 2, icon: '🧼' },
      { text: 'Một trận chiến sinh tử, gào thét và để lại 10 vết cào!', points: 0, icon: '⚔️' },
    ]
  },
  {
    question: 'Bé mèo của bạn có thói quen gạt chân vào bát nước uống không?',
    options: [
      { text: 'Rất hay gạt chân té nước khắp sàn rồi mới chịu uống', points: 3, icon: '🐾' },
      { text: 'Thỉnh thoảng nhúng ngón chân rồi liếm đầu ngón', points: 2, icon: '🥛' },
      { text: 'Chỉ uống lịch sự bằng lưỡi, không bao giờ nhúng chân', points: 1, icon: '👑' },
    ]
  }
];

export const CatSwimmingQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelectOption = (points: number) => {
    catAudio.playBubble();
    const newAnswers = [...selectedAnswers, points];
    setSelectedAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
      catAudio.playPurr();
      setTimeout(() => catAudio.playMeow(), 200);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsFinished(false);
    catAudio.playSplash(0.5);
  };

  const totalPoints = selectedAnswers.reduce((sum, p) => sum + p, 0);

  const getResultBadge = () => {
    if (totalPoints >= 10) {
      return {
        title: 'Kình Ngư Mèo Thần Thoại (Dòng Máu Turkish Van)',
        badge: '🏊‍♂️ Siêu Cấp Mê Nước',
        description: 'Bé mèo của bạn đích thực là một rái cá đội lốt mèo! Bé hoàn toàn có tiềm năng học bơi với áo phao an toàn và sẽ rất thích các chuyến đi hồ bơi hoặc dã ngoại ven suối.',
        color: 'from-cyan-500 to-teal-400',
        textColor: 'text-cyan-300'
      };
    } else if (totalPoints >= 6) {
      return {
        title: 'Mèo Thích Nghịch Nước Nông (Tố Chất Mèo Bengal)',
        badge: '🐾 Thích Vọc Nước Vui Nhộn',
        description: 'Boss nhà bạn rất tò mò với nước, thích nghịch vòi sen và bát nước. Bé có thể làm quen với việc ngâm chân nước ấm hoặc chơi vịt cao su nổi.',
        color: 'from-amber-500 to-orange-400',
        textColor: 'text-amber-300'
      };
    } else {
      return {
        title: 'Mèo Quý Tộc Sợ Ướt Lông',
        badge: '👑 Quý Tộc Khô Ráo',
        description: 'Boss thuộc trường phái giữ gìn nhan sắc lông khô sạch sẽ truyền thống. Đừng ép bé đi bơi, chỉ cần chải lông mượt mà và cho ăn hạt ngon là bé hạnh phúc rồi!',
        color: 'from-rose-500 to-pink-400',
        textColor: 'text-rose-300'
      };
    }
  };

  const result = getResultBadge();

  return (
    <div id="cat-swimming-quiz-section" className="max-w-2xl mx-auto space-y-6">
      
      {/* Quiz Header */}
      <div className="text-center space-y-2">
        <span className="bg-amber-500/20 text-amber-300 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30 inline-flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> Mini Game Trắc Nghiệm Vui
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Boss Nhà Bạn Có Tiềm Năng Bơi Lội Không?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Trả lời 4 câu hỏi tình huống hài hước để khám phá "hệ bơi lội" của mèo cưng
        </p>
      </div>

      {!isFinished ? (
        /* Active Question Card */
        <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6">
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-cyan-300">
              <span>Câu hỏi {currentStep + 1} / {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% hoàn thành</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {QUIZ_QUESTIONS[currentStep].question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {QUIZ_QUESTIONS[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt.points)}
                className="w-full p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-750 border border-slate-700/80 hover:border-cyan-400/60 text-left transition-all group flex items-center gap-3.5 hover:scale-[1.01]"
              >
                <span className="text-2xl p-2 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                  {opt.icon}
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-200 group-hover:text-cyan-300 flex-1">
                  {opt.text}
                </span>
              </button>
            ))}
          </div>

        </div>
      ) : (
        /* Result Result Display */
        <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl text-center space-y-6 animate-fade-in">
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950" />
          </div>

          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 bg-slate-900 border border-slate-700 ${result.textColor}`}>
              {result.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {result.title}
            </h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              {result.description}
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs text-slate-400">
            Tổng điểm yêu nước: <strong className="text-amber-300 text-base">{totalPoints}</strong> / 12 điểm
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm Lại Trắc Nghiệm</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
