import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./services/api', () => ({
  register: jest.fn(),
  login: jest.fn(),
  getProfile: jest.fn(),
  createShortUrl: jest.fn(),
  getMyUrls: jest.fn()
}));

import { getProfile, register, getMyUrls } from './services/api';

describe('App auth/user flows', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('shows login and toggles to register form', async () => {
    getProfile.mockResolvedValue({ success: false });

    render(<App />);

    // Should show landing page - check for the LinkVault logo which is unique to landing
    expect(await screen.findByText(/⚡ LinkVault/i)).toBeInTheDocument();
    
    // Click login button in nav to go to login page
    const loginButtons = screen.getAllByRole('button', { name: /Login/i });
    fireEvent.click(loginButtons[0]); // First login button is in nav

    // Should show login form with LoginPage
    expect(await screen.findByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();

    // Click toggle to register
    fireEvent.click(screen.getByRole('button', { name: /Don't have an account\? Register/i }));

    // Should show register form with username and email fields
    expect(await screen.findByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  });

  test('registers user, displays welcome and URL list', async () => {
    getProfile
      .mockResolvedValueOnce({ success: false })
      .mockResolvedValueOnce({ success: true, data: { user: { username: 'tester', email: 'tester@example.com' } } });

    register.mockResolvedValue({
      success: true,
      data: { token: 'abc123', user: { username: 'tester', email: 'tester@example.com' } }
    });

    getMyUrls.mockResolvedValue({
      success: true,
      data: [{ _id: '1', shortUrl: 'http://short.test/abc', longUrl: 'https://example.com', clicks: 0 }]
    });

    render(<App />);

    // Click login to go from landing to login form (use first login button from nav)
    const loginButtons = await screen.findAllByRole('button', { name: /Login/i });
    fireEvent.click(loginButtons[0]);

    // Click toggle to register
    fireEvent.click(screen.getByRole('button', { name: /Don't have an account\? Register/i }));

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'tester' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'tester@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'TestPass123!' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText(/Welcome tester/i)).toBeInTheDocument();
    expect(await screen.findByText(/http:\/\/short\.test\/abc/i)).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBe('abc123');

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({ username: 'tester', email: 'tester@example.com', password: 'TestPass123!' });
    });
  });
});
