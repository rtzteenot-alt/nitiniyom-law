import { useState } from "react";
import { AIChatBox } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, X } from "lucide-react";
import { useLocation } from "wouter";

export default function AIConsultant() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [, setLocation] = useLocation();
  const chatMutation = trpc.aiConsultant.chat.useMutation({
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.content,
        },
      ]);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      // Show error message to user
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถเชื่อมต่อกับ AI ได้ในขณะนี้"}`,
        },
      ]);
    },
  });

  const handleSendMessage = (content: string) => {
    const userMessage = {
      role: "user" as const,
      content,
    };

    // Add user message to chat
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Send to AI
    chatMutation.mutate({
      messages: updatedMessages,
    });
  };

  const suggestedPrompts: string[] = [
    "กฎหมายครอบครัวไทยเกี่ยวกับการหย่าร้างคืออะไร?",
    "ฉันสามารถฟ้องคดีแพ่งได้อย่างไร?",
    "กฎหมายแรงงานไทยคุ้มครองพนักงานอย่างไร?",
    "การจดทะเบียนนิติบุคคลต้องทำอย่างไร?",
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-amber-500/20 shadow-lg">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Legal Consultant</h1>
                <p className="text-amber-400 text-xs sm:text-sm mt-1">ปรึกษาด้านกฎหมายไทยระดับสูง</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="text-white hover:bg-amber-500/10 hidden sm:inline-flex"
              >
                {showSidebar ? "ซ่อน" : "แสดง"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/")}
                className="gap-2 text-white border-amber-500/30 hover:bg-amber-500/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">กลับหน้าแรก</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Screen Chat */}
      <div className="flex-1 overflow-hidden flex gap-4 px-4 py-4 sm:px-6">
        {/* Chat Section - Full Width */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 shadow-2xl overflow-hidden flex flex-col">
            <AIChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={chatMutation.isPending}
              placeholder="พิมพ์คำถามเกี่ยวกับกฎหมายไทย..."
              height={undefined}
              emptyStateMessage="👋 สวัสดีครับ! ฉันเป็นที่ปรึกษาด้านกฎหมายไทยที่มีความเชี่ยวชาญระดับสูง"
              suggestedPrompts={suggestedPrompts}
              className="bg-slate-800/30 flex-1"
            />
          </div>
        </div>

        {/* Sidebar - Responsive */}
        {showSidebar && (
          <div className="w-full sm:w-72 flex flex-col gap-4 overflow-y-auto">
            {/* Info Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl border border-amber-500/30 p-4 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  เกี่ยวกับ AI Consultant
                </h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="sm:hidden text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-amber-400 flex-shrink-0">✓</span>
                  <span>ความเชี่ยวชาญกฎหมายไทยระดับสูง</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 flex-shrink-0">✓</span>
                  <span>ตอบคำถามเกี่ยวกับกฎหมายแพ่ง อาญา ครอบครัว</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 flex-shrink-0">✓</span>
                  <span>ให้คำปรึกษาตามกฎหมายปัจจุบัน</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 flex-shrink-0">✓</span>
                  <span>พร้อมช่วยเหลือ 24/7</span>
                </li>
              </ul>
            </div>

            {/* Disclaimer Card */}
            <div className="bg-red-500/10 rounded-xl border border-red-500/30 p-4 backdrop-blur-sm flex-shrink-0">
              <h4 className="text-red-300 font-semibold mb-2 text-sm">⚠️ ข้อควรทราบ</h4>
              <p className="text-xs text-red-200">
                AI Consultant ให้คำปรึกษาทั่วไปเท่านั้น ไม่ใช่คำปรึกษาทางกฎหมายอย่างเป็นทางการ
                สำหรับเรื่องสำคัญ โปรดติดต่อทนายความโดยตรง
              </p>
            </div>

            {/* Contact Card */}
            <div className="bg-slate-700/50 rounded-xl border border-amber-500/20 p-4 backdrop-blur-sm flex-shrink-0">
              <h4 className="text-white font-semibold mb-2 text-sm">📞 ติดต่อเราโดยตรง</h4>
              <p className="text-xs text-slate-300 mb-3">
                ต้องการปรึกษาทนายความโดยตรง?
              </p>
              <Button
                onClick={() => setLocation("/#contact")}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                size="sm"
              >
                ติดต่อเรา
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
