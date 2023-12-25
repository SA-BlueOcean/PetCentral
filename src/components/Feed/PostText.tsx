"use client";
import { cn } from "@/utils/cn";
import { useState, useRef, useEffect } from "react";

type PostTextProps = {
  text: string;
};

export default function PostText({ text }: PostTextProps) {
  const [showFullText, setShowFullText] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(
        textRef.current.scrollHeight > textRef.current.clientHeight,
      );
    }
  }, [text]);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div className="relative">
      <div
        ref={textRef}
        className={cn(
          "overflow-hidden leading-snug",
          showFullText ? "max-h-full" : "line-clamp-2 max-h-[3em]",
        )}
      >
        <p>{text}</p>
      </div>
      {isOverflowing && (
        <button
          className="text-accent hover:underline focus:outline-none"
          onClick={toggleText}
        >
          {showFullText ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
