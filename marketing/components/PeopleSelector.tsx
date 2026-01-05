"use client";

import { useState, useRef, useEffect } from "react";

interface Person {
  id: number;
  name: string;
  type: string;
}

interface SelectedPerson {
  personId: number;
  role?: string;
}

interface PeopleSelectorProps {
  name: string;
  people: Person[];
  defaultValue?: string; // JSON array of SelectedPerson
}

const PERSON_TYPES: Record<string, string> = {
  team: "Team",
  collaborator: "Collaborator",
  advisor: "Advisor",
  partner: "Partner",
};

export function PeopleSelector({
  name,
  people,
  defaultValue = "[]",
}: PeopleSelectorProps) {
  const [selected, setSelected] = useState<SelectedPerson[]>(() => {
    try {
      return JSON.parse(defaultValue) || [];
    } catch {
      return [];
    }
  });
  const [newPersonId, setNewPersonId] = useState("");
  const [newRole, setNewRole] = useState("");
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = JSON.stringify(selected);
    }
  }, [selected]);

  const addPerson = () => {
    if (newPersonId && !selected.find((s) => s.personId === parseInt(newPersonId))) {
      setSelected([...selected, { personId: parseInt(newPersonId), role: newRole.trim() || undefined }]);
      setNewPersonId("");
      setNewRole("");
    }
  };

  const removePerson = (personId: number) => {
    setSelected(selected.filter((s) => s.personId !== personId));
  };

  const getPersonById = (id: number) => people.find((p) => p.id === id);

  // Group available people by type
  const availablePeople = people.filter((p) => !selected.find((s) => s.personId === p.id));
  const groupedPeople = availablePeople.reduce<Record<string, Person[]>>((acc, person) => {
    const type = person.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(person);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <input type="hidden" ref={hiddenInputRef} name={name} defaultValue={defaultValue} />

      {/* Selected people */}
      {selected.length > 0 && (
        <div className="space-y-2">
          {selected.map((entry) => {
            const person = getPersonById(entry.personId);
            if (!person) return null;
            return (
              <div
                key={entry.personId}
                className="flex items-center gap-3 px-3 py-2 bg-treatment-lemon/30 border border-text-dark rounded text-sm text-text-dark"
              >
                <span className="flex-1">
                  <span className="font-medium">{person.name}</span>
                  <span className="text-text-dark/60 ml-2">({PERSON_TYPES[person.type] || person.type})</span>
                  {entry.role && <span className="text-text-dark/70 ml-2">- {entry.role}</span>}
                </span>
                <button
                  type="button"
                  onClick={() => removePerson(entry.personId)}
                  className="text-text-dark/50 hover:text-red-600 transition-colors"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add new person */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-text-dark/70 mb-1 block">Person</label>
          <select
            value={newPersonId}
            onChange={(e) => setNewPersonId(e.target.value)}
            className="admin-select"
          >
            <option value="">Select a person...</option>
            {Object.entries(groupedPeople).map(([type, personList]) => (
              <optgroup key={type} label={PERSON_TYPES[type] || type}>
                {personList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-text-dark/70 mb-1 block">Role (optional)</label>
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="admin-input"
            placeholder="e.g., Speaker, Artist..."
          />
        </div>
        <button
          type="button"
          onClick={addPerson}
          disabled={!newPersonId}
          className="admin-btn-secondary !px-4 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      <p className="text-xs text-text-dark/50">
        Select people participating in this event.
      </p>
    </div>
  );
}
