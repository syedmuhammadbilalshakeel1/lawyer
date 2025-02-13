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
    category: "Admin (Chief Justice) Portal",
    questions: [
      {
        q: "What are the admin's responsibilities?",
        a: "The admin (chief justice) can: Assign cases to judges, Monitor total, assigned, and pending cases through a dashboard.",
      },
      {
        q: "Can the admin reject or modify case assignments?",
        a: "Yes, the chief justice can reassign or modify case allocations as needed.",
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

export function AdminFAQ() {
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
