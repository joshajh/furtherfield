"use client";

import { useState, useRef, useEffect } from "react";

interface DateEntry {
  date: string;
  endDate?: string;
  time?: string;
  isQualitative?: boolean;
  qualitativeText?: string;
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
  const [mode, setMode] = useState<"specific" | "range" | "qualitative">("specific");
  const [newDate, setNewDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newQualitativeText, setNewQualitativeText] = useState("");
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Sync dates to hidden input
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(dates);
    }
  }, [dates]);

  const addDate = () => {
    if (mode === "qualitative") {
      if (newQualitativeText.trim()) {
        setDates([
          ...dates,
          {
            date: "9999-12-31", // Placeholder for DB constraint
            isQualitative: true,
            qualitativeText: newQualitativeText.trim(),
          },
        ]);
        setNewQualitativeText("");
      }
    } else if (mode === "range") {
      if (newDate.trim() && newEndDate.trim()) {
        setDates([
          ...dates,
          {
            date: newDate.trim(),
            endDate: newEndDate.trim(),
            time: newTime.trim() || undefined,
          },
        ]);
        setNewDate("");
        setNewEndDate("");
      }
    } else {
      // Specific date
      if (newDate.trim()) {
        setDates([
          ...dates,
          {
            date: newDate.trim(),
            time: newTime.trim() || undefined,
          },
        ]);
        setNewDate("");
      }
    }
  };

  const removeDate = (index: number) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  const formatDate = (dateStr: string) => {
    if (dateStr === "9999-12-31") return "";
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

  const formatDateRange = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate + "T00:00:00");
      const end = new Date(endDate + "T00:00:00");

      const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
      const sameYear = start.getFullYear() === end.getFullYear();

      if (sameMonth) {
        // "16th-17th December 2025"
        return `${start.getDate()}${getOrdinalSuffix(start.getDate())}-${end.getDate()}${getOrdinalSuffix(end.getDate())} ${start.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
      } else if (sameYear) {
        // "30th November - 2nd December 2025"
        return `${start.getDate()}${getOrdinalSuffix(start.getDate())} ${start.toLocaleDateString("en-GB", { month: "long" })} - ${end.getDate()}${getOrdinalSuffix(end.getDate())} ${end.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
      } else {
        // Full dates for different years
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
      }
    } catch {
      return `${startDate} - ${endDate}`;
    }
  };

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch {
      return timeStr;
    }
  };

  const renderDateDisplay = (entry: DateEntry) => {
    if (entry.isQualitative) {
      return (
        <span className="italic">
          {entry.qualitativeText}
        </span>
      );
    }

    if (entry.endDate) {
      return (
        <span>
          {formatDateRange(entry.date, entry.endDate)}
          {entry.time && <span className="text-text-dark/70 ml-2">@ {formatTime(entry.time)}</span>}
        </span>
      );
    }

    return (
      <span>
        {formatDate(entry.date)}
        {entry.time && <span className="text-text-dark/70 ml-2">@ {formatTime(entry.time)}</span>}
      </span>
    );
  };

  const modeButtonClass = (isActive: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded transition-colors ${
      isActive
        ? "bg-text-dark text-bg-light"
        : "bg-transparent text-text-dark border border-text-dark hover:bg-treatment-lemon"
    }`;

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
                {renderDateDisplay(entry)}
              </span>
              <button
                type="button"
                onClick={() => removeDate(index)}
                className="text-text-dark/50 hover:text-red-600 transition-colors text-lg leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mode selector */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setMode("specific")}
          className={modeButtonClass(mode === "specific")}
        >
          Specific Date
        </button>
        <button
          type="button"
          onClick={() => setMode("range")}
          className={modeButtonClass(mode === "range")}
        >
          Date Range
        </button>
        <button
          type="button"
          onClick={() => setMode("qualitative")}
          className={modeButtonClass(mode === "qualitative")}
        >
          Recurring/Qualitative
        </button>
      </div>

      {/* Add new date - Specific */}
      {mode === "specific" && (
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
            <label className="text-xs text-text-dark/70 mb-1 block">Start Time (optional)</label>
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
            disabled={!newDate.trim()}
            className="admin-btn-secondary !px-4 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}

      {/* Add new date - Range */}
      {mode === "range" && (
        <div className="space-y-2">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs text-text-dark/70 mb-1 block">From</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="admin-input"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-text-dark/70 mb-1 block">To</label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                min={newDate}
                className="admin-input"
              />
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs text-text-dark/70 mb-1 block">Start Time (optional)</label>
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
              disabled={!newDate.trim() || !newEndDate.trim()}
              className="admin-btn-secondary !px-4 disabled:opacity-50"
            >
              Add Range
            </button>
          </div>
        </div>
      )}

      {/* Add new date - Qualitative */}
      {mode === "qualitative" && (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-xs text-text-dark/70 mb-1 block">Description</label>
            <input
              type="text"
              value={newQualitativeText}
              onChange={(e) => setNewQualitativeText(e.target.value)}
              placeholder="e.g., Last Sunday of every month"
              className="admin-input"
            />
          </div>
          <button
            type="button"
            onClick={addDate}
            disabled={!newQualitativeText.trim()}
            className="admin-btn-secondary !px-4 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}

      <p className="text-xs text-text-dark/50">
        {mode === "specific" && "Add individual dates for single-day or recurring events."}
        {mode === "range" && "Add date ranges for multi-day events (e.g., 16th-17th December)."}
        {mode === "qualitative" && "Add descriptive dates for recurring events (e.g., 'Last Sunday of every month')."}
      </p>
    </div>
  );
}
