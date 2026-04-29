'use client';
import { useState, useEffect } from 'react';
import { validateHabitName } from '@/lib/validators';
import type { Habit } from '@/types/habit';

interface Props {
  habit?: Habit;
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
}

export default function HabitForm({ habit, onSave, onCancel }: Props) {
  const isEditing = Boolean(habit);
  const [name, setName] = useState(habit?.name ?? '');
  const [description, setDesc] = useState(habit?.description ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    setName(habit?.name ?? '');
    setDesc(habit?.description ?? '');
    setNameError(null);
  }, [habit?.id]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const { valid, value, error } = validateHabitName(name);
    if (!valid) {
      setNameError(error);
      return;
    }
    onSave(value, description.trim());
  }

  return (
    <>
      <div className="sheet-backdrop" onClick={onCancel} />
      <div
        className="sheet-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-form-title"
      >
        <h2
          id="habit-form-title"
          className="font-display text-2xl font-bold text-dark-primary mb-6"
        >
          {isEditing ? 'Edit Habit' : 'Create Habit'}
        </h2>

        <form
          data-testid="habit-form"
          onSubmit={handleSave}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* Habit Name */}
          <div>
            <label htmlFor="habit-name" className="form-label">
              Habit Name
            </label>
            <input
              id="habit-name"
              data-testid="habit-name-input"
              type="text"
              placeholder="e.g Solve Eigenvectors today"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
              }}
              className={`form-input ${nameError ? 'error' : ''}`}
              aria-describedby={nameError ? 'habit-name-error' : undefined}
              aria-invalid={Boolean(nameError)}
            />
            {nameError && (
              <p
                id="habit-name-error"
                className="text-red-500 text-xs mt-1 flex items-center gap-1"
              >
                <span aria-hidden>⚠</span> {nameError}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="habit-description" className="form-label">
              Description
            </label>
            <input
              id="habit-description"
              data-testid="habit-description-input"
              type="text"
              placeholder="What does this habit involve?"
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="habit-frequency" className="form-label">
              Frequency
            </label>
            {isEditing ? (
              <div className="form-input text-text-secondary flex justify-between items-center">
                <span>Daily</span>
                <span className="text-xs tracking-wider uppercase text-text-secondary/60">
                  Locked
                </span>
              </div>
            ) : (
              <select
                id="habit-frequency"
                data-testid="habit-frequency-select"
                defaultValue="daily"
                disabled
                className="form-input appearance-none"
              >
                <option value="daily">Daily</option>
              </select>
            )}
          </div>

          <button
            type="submit"
            data-testid="habit-save-button"
            className="btn-primary"
          >
            {isEditing ? 'Save Changes' : 'Create Habit'}
          </button>
        </form>
      </div>
    </>
  );
}
