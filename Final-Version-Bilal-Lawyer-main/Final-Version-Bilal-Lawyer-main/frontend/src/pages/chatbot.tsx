"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Law {
  lawNumber: string;
  lawDescription: string;
  penalty?: string;
  explanation?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const constitutionLaws: Law[] = [
  {
    lawNumber: "Article 5",
    lawDescription:
      "Loyalty to the State is the basic duty of every citizen. No one shall defy the authority of the State, nor take any step that undermines its sovereignty.",
  },
  {
    lawNumber: "Section 302 (Pakistan Penal Code)",
    lawDescription:
      "Murder: Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine. The punishment may be more severe in cases of premeditated or heinous murder.",
    penalty:
      "Death or life imprisonment, and a fine. The punishment may be more severe in cases of premeditated or heinous murder.",
    explanation:
      "Section 302 applies to murder committed intentionally and unlawfully. The punishment varies depending on the nature of the crime, and in certain cases, the court may impose harsher penalties.",
  },
  {
    lawNumber: "Section 365 (Pakistan Penal Code)",
    lawDescription:
      "Kidnapping: Whoever kidnaps any person with the intent to cause that person to be confined, or to compel that person to do any act, shall be punished with imprisonment for up to 7 years, and a fine.",
  },
  // Add more sections and their explanations as needed...
  {
    lawNumber: "Article 5",
    lawDescription:
      "Loyalty to the State is the basic duty of every citizen. No one shall defy the authority of the State, nor take any step that undermines its sovereignty.",
    penalty: "N/A",
    explanation:
      "This article emphasizes the importance of loyalty to the state as a primary duty of every citizen. There is no specific penalty mentioned, as it is a fundamental principle of citizenship.",
  },
  {
    lawNumber: "Article 8",
    lawDescription:
      "Laws inconsistent with or in derogation of fundamental rights are void.",
    penalty: "N/A",
    explanation:
      "This article ensures that any law contradicting fundamental rights will be deemed invalid. There is no direct penalty associated with this article, but it ensures constitutional rights are upheld.",
  },
  {
    lawNumber: "Article 9",
    lawDescription:
      "No person shall be deprived of life or liberty except in accordance with law.",
    penalty: "N/A",
    explanation:
      "This law prevents arbitrary detention or deprivation of life, ensuring due process. The penalty for violation would be determined according to the circumstances of the case.",
  },
  {
    lawNumber: "Article 10",
    lawDescription:
      "No person shall be arrested except in accordance with the law, and must be informed of the reasons for their arrest.",
    penalty: "N/A",
    explanation:
      "The law guarantees the right to know the reason for arrest. If violated, penalties would depend on the specific case and legal proceedings.",
  },
  {
    lawNumber: "Article 14",
    lawDescription:
      "The dignity of man and, subject to law, the privacy of home, shall be inviolable.",
    penalty: "N/A",
    explanation:
      "This article protects human dignity and the privacy of the home. Any violation could lead to legal action, with penalties decided by the court.",
  },
  {
    lawNumber: "Article 17",
    lawDescription:
      "Every citizen shall have the right to form or be a member of a political party.",
    penalty: "N/A",
    explanation:
      "This law ensures the freedom to form or join political parties. There is no specific penalty mentioned for violations, as it is a fundamental right.",
  },
  {
    lawNumber: "Article 18",
    lawDescription:
      "No person shall be denied access to a public office based on any discrimination.",
    penalty: "N/A",
    explanation:
      "This ensures equal access to public office. Discriminatory practices would be subject to legal penalties as per the laws of equality.",
  },
  {
    lawNumber: "Article 19",
    lawDescription:
      "Freedom of speech and expression is guaranteed, subject to reasonable restrictions imposed by law in the interests of the sovereignty, integrity, and security of Pakistan.",
    penalty: "N/A",
    explanation:
      "This article protects freedom of speech but allows for restrictions in specific circumstances. Violations can lead to penalties, which would depend on the specific case.",
  },
  {
    lawNumber: "Article 20",
    lawDescription:
      "Every citizen shall have the right to practice his religion, subject to law.",
    penalty: "N/A",
    explanation:
      "This law protects the right to practice religion, subject to public order. Violations can be penalized based on the specific context of the case.",
  },
  {
    lawNumber: "Article 21",
    lawDescription:
      "No person shall be deprived of their property except by lawful authority.",
    penalty: "N/A",
    explanation:
      "This ensures protection of property rights. If property is seized unlawfully, the violators could face legal action, with penalties determined by the court.",
  },
  {
    lawNumber: "Article 22",
    lawDescription:
      "No person shall be discriminated against on the grounds of their religion, race, caste, or place of birth.",
    penalty: "N/A",
    explanation:
      "This guarantees non-discrimination. Discriminatory actions would lead to penalties based on the nature and severity of the violation.",
  },
  {
    lawNumber: "Article 23",
    lawDescription:
      "Every citizen shall have the right to freely move and reside in any part of Pakistan.",
    penalty: "N/A",
    explanation:
      "This law protects the freedom of movement. Any unlawful restrictions on movement could be penalized as per legal procedures.",
  },
  {
    lawNumber: "Article 24",
    lawDescription:
      "The State shall not arbitrarily deprive a citizen of their property or any right to property.",
    penalty: "N/A",
    explanation:
      "This article protects property rights. If the state unlawfully deprives property, the individual may seek legal recourse, and penalties will be based on the case.",
  },
  {
    lawNumber: "Article 25",
    lawDescription:
      "All citizens are equal before the law and are entitled to equal protection of the law. No discrimination based on sex, religion, or ethnicity is allowed.",
    penalty: "N/A",
    explanation:
      "This article ensures equality before the law. Any form of discrimination is subject to legal penalties, depending on the situation.",
  },
  {
    lawNumber: "Article 25-A",
    lawDescription:
      "The State shall provide free and compulsory education to all children of the age of five to sixteen years in such manner as may be determined by law.",
    penalty: "N/A",
    explanation:
      "The state is required to provide free education to children. Non-compliance with this obligation could result in legal action against the government or relevant parties.",
  },
  {
    lawNumber: "Article 32",
    lawDescription:
      "The State shall make a provision for the welfare of the people in areas of special need such as health, education, and employment.",
    penalty: "N/A",
    explanation:
      "This article mandates the government to provide welfare services. Non-fulfillment of this obligation may result in legal and administrative consequences.",
  },
  {
    lawNumber: "Article 37",
    lawDescription:
      "The State shall ensure inexpensive and expeditious justice.",
    penalty: "N/A",
    explanation:
      "The government is required to ensure affordable and timely justice. Failure to ensure this could result in action against the state institutions responsible.",
  },
  {
    lawNumber: "Article 38",
    lawDescription:
      "The State shall provide social and economic justice for all its citizens.",
    penalty: "N/A",
    explanation:
      "This article ensures that the state provides justice in social and economic matters. Any violations would result in actions in the judicial system.",
  },
  {
    lawNumber: "Article 39",
    lawDescription:
      "The State shall ensure the welfare of the people through the provision of public services and opportunities.",
    penalty: "N/A",
    explanation:
      "The state is responsible for ensuring welfare through public services. Failure to deliver these services could lead to penalties as per the law.",
  },
  {
    lawNumber: "Article 40",
    lawDescription:
      "The State shall promote the welfare of the people and ensure that everyone has the opportunity to participate in social, economic, and political activities.",
    penalty: "N/A",
    explanation:
      "This article emphasizes the importance of social, economic, and political participation. Violations could lead to consequences as decided by the judiciary.",
  },
  {
    lawNumber: "Article 45",
    lawDescription:
      "The President shall have the power to grant pardons, reprieves, and respites and to remit, suspend or commute any sentence passed by any court, tribunal, or other authority.",
    penalty: "N/A",
    explanation:
      "This article grants the President the power of mercy. There is no penalty involved, but it is an important power in the criminal justice system.",
  },
  {
    lawNumber: "Article 50",
    lawDescription:
      "There shall be a Parliament consisting of the President, the National Assembly, and the Senate.",
    penalty: "N/A",
    explanation:
      "This defines the structure of the Parliament. It is a constitutional provision and does not directly entail penalties.",
  },
  {
    lawNumber: "Article 59",
    lawDescription:
      "The President, after consulting the Prime Minister, may appoint the Chairman and Deputy Chairman of the Senate.",
    penalty: "N/A",
    explanation:
      "This article defines the power to appoint key figures in the Senate. No penalty is prescribed, as it concerns parliamentary procedures.",
  },

  // Articles on serious crimes (Example)
  {
    lawNumber: "Section 302 (Pakistan Penal Code)",
    lawDescription:
      "Murder: Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine. The punishment may be more severe in cases of premeditated or heinous murder.",
    penalty:
      "Death or life imprisonment, and a fine. The punishment may be more severe in cases of premeditated or heinous murder.",
    explanation:
      "Section 302 applies to murder committed intentionally and unlawfully. The punishment varies depending on the nature of the crime, and in certain cases, the court may impose harsher penalties.",
  },
  {
    lawNumber: "Section 365 (Pakistan Penal Code)",
    lawDescription:
      "Kidnapping: Whoever kidnaps any person with the intent to cause that person to be confined, or to compel that person to do any act, shall be punished with imprisonment for up to 7 years, and a fine.",
    penalty: "Imprisonment for up to 7 years, and a fine.",
    explanation:
      "This law criminalizes the act of kidnapping with the intent to force an individual into doing something. The penalty may vary depending on the case specifics.",
  },
  // Repeat similar structure for other serious crime laws...
];

function matchConstitutionLaw(userInput: string): string {
  const matchingLaw = constitutionLaws.find(
    (law) =>
      userInput.toLowerCase().includes(law.lawNumber.toLowerCase()) ||
      userInput
        .toLowerCase()
        .includes(
          law.lawDescription.toLowerCase().split(" ").slice(0, 5).join(" ")
        )
  );

  return matchingLaw
    ? `This law is applicable: ${matchingLaw.lawNumber} - ${matchingLaw.lawDescription} \nPenalty: ${matchingLaw.penalty}\nExplanation: ${matchingLaw.explanation}`
    : "No matching law found based on your input.";
}

export default function ChatBot(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! How can I help you with the Law?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, messagesEndRef]); // Added messagesEndRef to dependencies

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleChat = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const matchedLaw = matchConstitutionLaw(input);

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message:
            matchedLaw !== "No matching law found based on your input."
              ? `Explain in detail: ${matchedLaw}`
              : `Provide a general legal answer: ${input}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: " + data.error },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error fetching response. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };
  

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 bg-black hover:bg-gray-800 text-white z-50"
        onClick={() => setIsOpen(true)}
      >
        <span className="sr-only">Open chat</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </Button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => setIsOpen(false)}
      />
      <Card className="fixed bottom-4 right-4 w-[380px] h-[560px] p-0 flex flex-col shadow-xl bg-white z-50">
        <div className="flex items-center justify-between border-b p-4 bg-[#111827]">
          <h2 className="text-xl font-semibold text-white">Chat with us</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close chat</span>
          </Button>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            maxHeight: "calc(100% - 120px)",
            background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === "assistant"
                  ? "bg-muted text-foreground ml-0 shadow-sm bg-slate-300"
                  : "bg-primary text-primary-foreground ml-auto shadow-sm bg-blue-200"
              )}
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-white p-4 relative">
          <div className="relative bg-white">
            <textarea
              ref={textareaRef}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="w-full resize-none overflow-hidden border rounded-xl p-3 pr-12 max-h-32 focus:outline-none focus:ring-2 focus:ring-black"
              rows={1}
              style={{
                minHeight: "48px",
              }}
            />
            <button
              onClick={handleChat}
              disabled={loading || !input.trim()}
              className={cn(
                "absolute right-2 bottom-2 p-2 rounded-lg",
                input.trim()
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}
