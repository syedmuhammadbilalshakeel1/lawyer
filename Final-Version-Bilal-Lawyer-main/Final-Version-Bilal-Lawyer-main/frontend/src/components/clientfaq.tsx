"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "General Questions",
    questions: [
      {
        q: "What is the Legal Case Management System?",
        a: "The Legal Case Management System is a web-based platform designed to automate legal processes in Pakistan. It provides four distinct portals for clients, lawyers, judges, and the admin (chief justice) to streamline case management, communication, document handling, and notifications. The system enhances efficiency by allowing seamless interaction between all stakeholders.",
      },
      {
        q: "Who can use this system?",
        a: "This system is designed for clients who need legal assistance, lawyers who handle cases, judges who manage hearings, and admins (chief justices) who oversee case assignments. Each user has role-specific features to ensure smooth legal case management.",
      },
      {
        q: "Is this system available for all courts in Pakistan?",
        a: "Initially, the system is designed for specific courts. However, it can be expanded to accommodate more courts based on requirements.",
      },
    ],
  },
  {
    category: "Client Portal",
    questions: [
      {
        q: "How can a client hire a lawyer?",
        a: "Clients can sign up and log in to browse lawyers based on their expertise. They can view lawyer profiles, check their success rates, and hire them for legal representation.",
      },
      {
        q: "Can a client track case progress?",
        a: "Yes, clients can view their case details, receive notifications for hearing dates, and access case documents (PDFs) uploaded by the judge after each hearing.",
      },
      {
        q: "How does the client communicate with their lawyer?",
        a: "Clients can chat with their lawyers through the system and share documents securely.",
      },
      {
        q: "Can clients give feedback on lawyers?",
        a: "Yes, clients can rate lawyers using a star system and write reviews based on their experience.",
      },
      {
        q: "How will clients be notified about case updates?",
        a: "Clients receive notifications when: A lawyer accepts their case, A judge schedules a hearing, A new case document (PDF) is uploaded.",
      },
      {
        q: "Is there any legal assistance available for clients?",
        a: "Yes, an AI-powered chatbot is available to provide guidance on legal procedures, laws, and case-related queries.",
      },
    ],
  },
  
  {
    category: "Technical & Security Questions",
    questions: [
      {
        q: "How secure is this system?",
        a: "The platform uses encryption for data security, ensuring that documents, messages, and payments remain protected.",
      },
      {
        q: "Can multiple users access the system at the same time?",
        a: "Yes, it is a multi-user web application that allows real-time updates and notifications.",
      },
      {
        q: "What happens if a user forgets their password?",
        a: "Users can reset their password through an email authentication process.",
      },
      {
        q: "Is this system available on mobile devices?",
        a: "Currently, it is a web-based platform, but a mobile-friendly version may be developed in the future.",
      },
    ],
  },
];

export function ClientFAQ() {
  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        FAQs – Legal Case Management System
      </h1>
      {faqData.map((category, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
          <Accordion type="single" collapsible className="w-full">
            {category.questions.map((item, qIndex) => (
              <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                <AccordionTrigger className="text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}
