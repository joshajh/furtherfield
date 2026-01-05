"use client";

import { useState, useRef, useEffect } from "react";

interface DateEntry {
  date: string;
  time?: string;
}

interface DateListEditorProps {
  name: string;
  defaultValue?: string; // JSON array string of DateEntry
}

export function DateListEditor({
  name,
  defaultValue = "[]",
}: DateListEditorProps) {
  const [dates, setDates] = useState<DateEntry[]>(() => {
    try {
      return JSON.parse(defaultValue) || [];
    } catch {
      return [];
    }
  });
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Sync dates to hidden input without relying on React state for form value
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(dates);
    }
  }, [dates]);

  const addDate = () => {
    if (newDate.trim()) {
      setDates([...dates, { date: newDate.trim(), time: newTime.trim() || undefined }]);
      setNewDate("");
      // Keep the time for convenience when adding multiple dates with same time
    }
  };

  const removeDate = (index: number) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + "T00:00:00");
      return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
      // timeStr is in HH:MM format (24h)
      const [hours, minutes] = timeStr.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="space-y-3">
      <input type="hidden" ref={hiddenInputRef} name={name} defaultValue={defaultValue} />

      {/* Current dates */}
      {dates.length > 0 && (
        <div className="space-y-2">
          {dates.map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-3 py-2 bg-treatment-lemon/30 border border-text-dark rounded text-sm text-text-dark"
            >
              <span className="flex-1">
                {formatDate(entry.date)}
                {entry.time && <span className="text-text-dark/70 ml-2">@ {formatTime(entry.time)}</span>}
              </span>
              <button
                type="button"
                onClick={() => removeDate(index)}
                className="text-text-dark/50 hover:text-red-600 transition-colors"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new date */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-text-dark/70 mb-1 block">Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="admin-input"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-text-dark/70 mb-1 block">Start Time</label>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="admin-input"
          />
        </div>
        <button
          type="button"
          onClick={addDate}
          className="admin-btn-secondary !px-4"
        >
          Add
        </button>
      </div>
      <p className="text-xs text-text-dark/50">
        Add multiple dates for recurring or multi-day events.
      </p>
    </div>
  );
}
