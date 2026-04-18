import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
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
});
