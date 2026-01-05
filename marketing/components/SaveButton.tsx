"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useState, useRef } from "react";

interface SaveButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function SaveButton({ children = "Save", className = "admin-btn" }: SaveButtonProps) {
  const { pending } = useFormStatus();
  const [showSuccess, setShowSuccess] = useState(false);
  const wasSubmitting = useRef(false);

  useEffect(() => {
    // When transitioning from pending to not pending, show success
    if (wasSubmitting.current && !pending) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
    wasSubmitting.current = pending;
  }, [pending]);

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} relative inline-flex items-center gap-2 transition-all ${pending ? "opacity-70" : ""}`}
    >
      {pending ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Saving...
        </>
      ) : showSuccess ? (
        <>
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Saved!
        </>
      ) : (
        children
      )}
    </button>
  );
}
