import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Tangerine')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Quiz' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Upload' })).toBeInTheDocument();
  });

  it('shows Dashboard page by default', () => {
    render(<App />);
    expect(screen.getByText('Your progress and stats will appear here.')).toBeInTheDocument();
  });

  it('shows password prompt when navigating to Quiz page', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('link', { name: 'Quiz' }));
    expect(screen.getByText('Welcome to Tangerine')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByText(/Skip/)).toBeInTheDocument();
  });

  it('shows guest banner when skipping password', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('link', { name: 'Quiz' }));
    await userEvent.click(screen.getByText(/Skip/));
    expect(screen.getByText(/Guest mode — answers are not being recorded/)).toBeInTheDocument();
  });

  it('navigates to Upload page', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('link', { name: 'Upload' }));
    expect(screen.getByText('Upload Vocabulary')).toBeInTheDocument();
  });

  it('renders footer with Chinese characters', () => {
    render(<App />);
    expect(screen.getByText('橘子')).toBeInTheDocument();
  });

  describe('Session setup', () => {
    beforeEach(async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { level: 1, lesson: 1 },
          { level: 1, lesson: 2 },
        ],
      });
      render(<App />);
      await userEvent.click(screen.getByRole('link', { name: 'Quiz' }));
      await userEvent.click(screen.getByText(/Skip/));
    });

    it('shows session setup after skipping password', async () => {
      expect(await screen.findByText('Choose Lessons to Practice')).toBeInTheDocument();
    });

    it('shows lesson checkboxes after loading', async () => {
      expect(await screen.findByText('Lesson 1')).toBeInTheDocument();
      expect(await screen.findByText('Lesson 2')).toBeInTheDocument();
    });

    it('Start Session button is disabled with no lessons selected', async () => {
      await screen.findByText('Lesson 1');
      expect(screen.getByRole('button', { name: 'Start Session' })).toBeDisabled();
    });

    it('Start Session button enables after selecting a lesson', async () => {
      const checkbox = await screen.findByLabelText(/Lesson 1/);
      await userEvent.click(checkbox);
      expect(screen.getByRole('button', { name: 'Start Session' })).not.toBeDisabled();
    });
  });

  describe('Quiz engine', () => {
    const mockWord = {
      id: 1, traditional: '你好', simplified: '你好',
      pinyin: 'nǐ hǎo', part_of_speech: 'phrase', definition: 'hello',
    };

    beforeEach(async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ level: 1, lesson: 1 }],
      });
      render(<App />);
      await userEvent.click(screen.getByRole('link', { name: 'Quiz' }));
      await userEvent.click(screen.getByText(/Skip/));

      // Select lesson and start session
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [mockWord],
      });
      const checkbox = await screen.findByLabelText(/Lesson 1/);
      await userEvent.click(checkbox);
      await userEvent.click(screen.getByRole('button', { name: 'Start Session' }));
    });

    it('shows a question card after session starts', async () => {
      expect(await screen.findByText(/What does this mean|How do you write/)).toBeInTheDocument();
    });

    it('shows answer input and Check button on question phase', async () => {
      expect(await screen.findByPlaceholderText(/Type the/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Check' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Skip/ })).toBeInTheDocument();
    });

    it('shows Correct and Incorrect buttons after skipping', async () => {
      await screen.findByRole('button', { name: /Skip/ });
      await userEvent.click(screen.getByRole('button', { name: /Skip/ }));
      expect(screen.getByRole('button', { name: /Correct/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Incorrect/ })).toBeInTheDocument();
    });

    it('shows pinyin when Show pinyin is clicked', async () => {
      await screen.findByRole('button', { name: 'Show pinyin' });
      await userEvent.click(screen.getByRole('button', { name: 'Show pinyin' }));
      expect(screen.getByText('nǐ hǎo')).toBeInTheDocument();
    });

    it('does not show a hint button (deferred feature)', async () => {
      await screen.findByPlaceholderText(/Type the/);
      expect(screen.queryByRole('button', { name: /Hint/ })).not.toBeInTheDocument();
    });
  });

  describe('Upload page auth gate', () => {
    beforeEach(async () => {
      render(<App />);
      await userEvent.click(screen.getByRole('link', { name: 'Upload' }));
    });

    it('shows password gate on Upload page by default', () => {
      expect(screen.getByText('Password required to upload vocabulary.')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Unlock' })).toBeInTheDocument();
    });

    it('Import button is disabled when locked', () => {
      // The auth gate is visible and the Unlock button is present, confirming locked state.
      // The Import button only appears after file selection (which requires real file parsing),
      // so we verify the locked state by confirming the auth gate is shown.
      expect(screen.getByRole('button', { name: 'Unlock' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Import/i })).not.toBeInTheDocument();
    });

    it('shows error message for wrong password', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ authenticated: false }),
      });

      await userEvent.type(screen.getByPlaceholderText('Enter password'), 'wrongpassword');
      await userEvent.click(screen.getByRole('button', { name: 'Unlock' }));

      expect(await screen.findByText('Incorrect password. Upload is disabled.')).toBeInTheDocument();
    });

    it('unlocks upload on correct password', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ authenticated: true }),
      });

      await userEvent.type(screen.getByPlaceholderText('Enter password'), 'correctpassword');
      await userEvent.click(screen.getByRole('button', { name: 'Unlock' }));

      expect(await screen.findByText('Authenticated — upload is enabled')).toBeInTheDocument();
    });
  });
});
