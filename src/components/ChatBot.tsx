import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, RotateCcw, X, ArrowUp } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ChatBot: React.FC = () => {
  const { user, goals, meals, totalCalories, totalWater, currentScreen, healthTelemetry } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const remainingKcal = Math.max(0, goals.dailyCalories - totalCalories);
  const remainingWater = Math.max(0, goals.dailyHydration - totalWater);

  const mealsSummary = meals
    .map((m) => `${m.mealType}: ${m.name} (${m.calories} kcal)`)
    .join(', ');

  const healthSnippet = healthTelemetry
    ? `\n\n🏃 **Google Health**: ${healthTelemetry.stepsToday.toLocaleString()} steps taken · ${healthTelemetry.activeCaloriesBurned} kcal active burn synced.`
    : '';

  const initialGreeting: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: `Peaceful day, ${user.name.split(' ')[0]}. I am Sage, your mindful wellness companion.\n\nYou have consumed **${totalCalories.toLocaleString()} kcal** today with **${remainingKcal.toLocaleString()} kcal** remaining towards your daily anchor. Your hydration is at **${totalWater.toLocaleString()} ml** (${remainingWater.toLocaleString()} ml to goal).${healthSnippet}\n\nHow may I support your nourishment today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggested Prompts
  const suggestedPrompts = [
    '🍽️ What should I have for dinner?',
    '🏃‍♂️ Factor my Google Health activity into my meal plan',
    '💧 How is my hydration pacing today?',
    '🥑 High-protein snack under 200 kcal',
    '⚖️ How can I balance my macros?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const payloadMessages = updatedMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: payloadMessages,
          userContext: {
            userName: user.name,
            dailyCalories: goals.dailyCalories,
            consumedCalories: totalCalories,
            remainingCalories: remainingKcal,
            dailyHydration: goals.dailyHydration,
            consumedWater: totalWater,
            remainingWater,
            massUnit: goals.massUnit,
            energyUnit: goals.energyUnit,
            mealsSummary,
            healthTelemetry: healthTelemetry
              ? {
                  stepsToday: healthTelemetry.stepsToday,
                  activeCaloriesBurned: healthTelemetry.activeCaloriesBurned,
                  activeMinutesToday: healthTelemetry.activeMinutesToday,
                }
              : null,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Your mindful presence nourishes both mind and body.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(
        'Sage experienced a gentle pause. Please check your connection or try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([initialGreeting]);
    setErrorMessage(null);
  };

  const renderFormattedMessage = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={idx > 0 && line.trim() === '' ? 'h-2' : 'my-0.5'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-[#1c1c17]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <em key={pIdx} className="italic text-[#434841]">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  const hideOnScreens = ['auth', 'onboarding-1', 'onboarding-2', 'onboarding-3'];
  if (hideOnScreens.includes(currentScreen)) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-8 z-40 animate-in fade-in zoom-in duration-200">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Ask Sage AI Chatbot"
            className="group relative flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-[#243d24] hover:bg-[#344a3a] text-white shadow-[0_6px_20px_rgba(36,61,36,0.38),inset_0_1px_1px_rgba(255,255,255,0.25)] active:scale-95 transition-all border border-white/10 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#243d24] shadow-sm shrink-0">
              <Sprout className="w-4 h-4 text-[#243d24]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-editorial text-[14px] leading-tight font-medium text-white flex items-center gap-1.5">
                Ask Sage
              </span>
              <span className="text-[10px] text-[#cfe9d3] uppercase tracking-wider font-semibold">
                Gemini AI Guide
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 sm:pr-8 bg-black/35 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:w-[420px] h-[85vh] sm:h-[640px] bg-[#fcf9f1] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#e5e2da] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
            {/* Top Drag Handle on Mobile */}
            <div className="sm:hidden w-full flex justify-center pt-2 pb-1 bg-[#f6f3eb]">
              <div className="w-10 h-1 rounded-full bg-[#c3c8bf]" />
            </div>

            {/* Header */}
            <div className="bg-[#f6f3eb] px-4 py-3 border-b border-[#e5e2da] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#243d24] shadow-sm">
                  <Sprout className="w-5 h-5 text-[#243d24]" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4a6549] ring-2 ring-[#f6f3eb]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-editorial text-[18px] text-[#1c1c17] font-semibold leading-tight">Sage</h3>
                    <span className="bg-[#ccebc7] text-[#07200b] text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      Gemini AI
                    </span>
                  </div>
                  <span className="text-[11px] text-[#737970] truncate">
                    {remainingKcal.toLocaleString()} kcal left · {(totalWater / 1000).toFixed(1)}L water
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title="Clear conversation"
                  aria-label="Clear chat"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#737970] hover:text-[#1c1c17] hover:bg-[#e5e2da] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#737970] hover:text-[#1c1c17] hover:bg-[#e5e2da] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[88%]">
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#243d24] shrink-0 mb-1 shadow-xs">
                        <Sprout className="w-3.5 h-3.5 text-[#243d24]" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-xs ${
                        msg.role === 'user'
                          ? 'bg-[#243d24] text-[#ffffff] rounded-br-xs'
                          : 'bg-[#ffffff] text-[#1c1c17] rounded-bl-xs border border-[#e5e2da]'
                      }`}
                    >
                      {renderFormattedMessage(msg.content)}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#737970] mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {/* Contemplating Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#243d24] shrink-0 shadow-xs">
                    <Sprout className="w-3.5 h-3.5 text-[#243d24]" />
                  </div>
                  <div className="p-3 rounded-2xl bg-[#ffffff] border border-[#e5e2da] shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#8ba888] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#8ba888] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#8ba888] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[12px] text-[#737970] ml-1 italic font-medium">Contemplating...</span>
                  </div>
                </div>
              )}

              {/* Error notice */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-[#ffdad6]/70 border border-[#ba1a1a]/30 text-[#93000a] text-[12px] flex items-center justify-between">
                  <span>{errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    className="underline font-semibold ml-2"
                  >
                    Retry
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Strip */}
            <div className="px-3 pt-2 pb-1.5 border-t border-[#e5e2da]/70 bg-[#f6f3eb]/70 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-full bg-[#ffffff] hover:bg-[#ebe8e0] text-[#434841] text-[11px] whitespace-nowrap border border-[#e5e2da] shadow-xs transition-colors shrink-0 font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#f6f3eb] border-t border-[#e5e2da] flex items-center gap-2"
            >
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Sage about recipes, calories, hydration..."
                  disabled={isLoading}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-full bg-[#ffffff] border border-[#e5e2da] text-[13.5px] text-[#1c1c17] placeholder:text-[#737970] focus:outline-none focus:ring-2 focus:ring-[#4a6549] shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="w-10 h-10 rounded-full bg-[#243d24] hover:bg-[#344a3a] disabled:opacity-40 text-white flex items-center justify-center shadow-sm active:scale-95 transition-all shrink-0"
              >
                <ArrowUp className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
