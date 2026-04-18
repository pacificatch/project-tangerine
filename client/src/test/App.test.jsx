import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
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

  it('navigates to Quiz page', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('link', { name: 'Quiz' }));
    expect(screen.getByText('Your quiz session will appear here.')).toBeInTheDocument();
  });

  it('navigates to Upload page', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('link', { name: 'Upload' }));
    expect(screen.getByText('Upload your CSV or Excel vocabulary file here.')).toBeInTheDocument();
  });

  it('renders footer with Chinese characters', () => {
    render(<App />);
    expect(screen.getByText('橘子')).toBeInTheDocument();
  });
});
