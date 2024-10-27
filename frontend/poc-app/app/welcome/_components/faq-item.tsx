"use client";

import { useState } from "react";

export const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div>
        <h2
          onClick={() => setIsOpen(!isOpen)}
          className=" font-semibold text-content text-xl hover:text-accent primary-focus cursor-pointer"
        >
          {question}
        </h2>
        {isOpen && (
          <div className="mt-2 text-base-content ">
            {answer}
          </div>
        )}
        <hr className="my-4"/>
      </div>
    );
  };