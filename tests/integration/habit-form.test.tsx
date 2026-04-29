import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}))

import HabitList from '@/components/habits/HabitList'
import { saveSession } from '@/lib/storage'
import { createHabit, getHabits } from '@/lib/habits'
import { getHabitSlug } from '@/lib/slug'
import type { Session } from '@/types/auth'

const SESSION: Session = { userId: 'user-1', email: 'test@test.com' }

beforeEach(() => {
  localStorage.clear()
  saveSession(SESSION)
})

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    render(<HabitList session={SESSION} />)

    fireEvent.click(screen.getAllByTestId('create-habit-button')[0])
    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeInTheDocument()
    })
  })

  it('creates a new habit and renders it in the list', async () => {
    render(<HabitList session={SESSION} />)

    fireEvent.click(screen.getAllByTestId('create-habit-button')[0])
    await userEvent.type(screen.getByTestId('habit-name-input'), 'Drink Water')
    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(
        screen.getByTestId(`habit-card-${getHabitSlug('Drink Water')}`)
      ).toBeInTheDocument()
    })
  })

  it('edits an existing habit and preserves immutable fields', async () => {
    const original = createHabit('user-1', 'Meditate', 'Morning session')

    render(<HabitList session={SESSION} />)

    const editBtn = await screen.findByTestId(`habit-edit-${getHabitSlug('Meditate')}`)
    fireEvent.click(editBtn)

    const nameInput = screen.getByTestId('habit-name-input') as HTMLInputElement
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Meditate Daily')
    fireEvent.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(
        screen.getByTestId(`habit-card-${getHabitSlug('Meditate Daily')}`)
      ).toBeInTheDocument()
    })

    const saved = getHabits().find(h => h.name === 'Meditate Daily')!
    expect(saved.id).toBe(original.id)
    expect(saved.userId).toBe(original.userId)
    expect(saved.createdAt).toBe(original.createdAt)
    expect(saved.completions).toEqual(original.completions)
    expect(saved.frequency).toBe('daily')
  })

  it('deletes a habit only after explicit confirmation', async () => {
    createHabit('user-1', 'Read Books', '')

    render(<HabitList session={SESSION} />)

    const slug = getHabitSlug('Read Books')
    const deleteBtn = await screen.findByTestId(`habit-delete-${slug}`)

    // Click delete — card must still be visible before confirmation
    fireEvent.click(deleteBtn)
    expect(screen.getByTestId(`habit-card-${slug}`)).toBeInTheDocument()

    // Confirm deletion
    fireEvent.click(screen.getByTestId('confirm-delete-button'))

    await waitFor(() => {
      expect(screen.queryByTestId(`habit-card-${slug}`)).not.toBeInTheDocument()
    })
  })

  it('toggles completion and updates the streak display', async () => {
    createHabit('user-1', 'Exercise', '')

    render(<HabitList session={SESSION} />)

    const slug      = getHabitSlug('Exercise')
    const streakEl  = await screen.findByTestId(`habit-streak-${slug}`)
    const toggleBtn = screen.getByTestId(`habit-complete-${slug}`)

    // Initially 0
    expect(streakEl).toHaveTextContent('0 day streak')

    // Mark complete — streak becomes 1
    fireEvent.click(toggleBtn)
    await waitFor(() => expect(streakEl).toHaveTextContent('1 day streak'))

    // Unmark — streak returns to 0
    fireEvent.click(toggleBtn)
    await waitFor(() => expect(streakEl).toHaveTextContent('0 day streak'))
  })
})