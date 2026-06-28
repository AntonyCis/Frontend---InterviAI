import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Forgot } from './Forgot';

const mockFetchDataBackend = vi.fn();

vi.mock('../hooks/useFetch', () => ({
  useFetch: () => mockFetchDataBackend,
  default: () => mockFetchDataBackend,
}));

vi.mock('../context/storeTheme', () => ({
  default: () => ({
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

vi.mock('vanta/dist/vanta.globe.min', () => ({ default: () => ({ destroy: vi.fn() }) }));
vi.mock('three', () => ({}));

describe('Forgot password page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario con campo de email y botón de envío', () => {
    render(
      <BrowserRouter>
        <Forgot />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/nombre@empresa.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar enlace/i })).toBeInTheDocument();
    expect(screen.getByText(/Recuperar/i)).toBeInTheDocument();
  });

  it('debe llamar al backend con el email al hacer submit', async () => {
    mockFetchDataBackend.mockResolvedValue({ msg: 'Revisa tu correo' });

    render(
      <BrowserRouter>
        <Forgot />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/nombre@empresa.com/i), {
      target: { value: 'test@correo.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /enviar enlace/i }));

    await waitFor(() => {
      expect(mockFetchDataBackend).toHaveBeenCalled();
    });

    const call = mockFetchDataBackend.mock.calls[0];
    expect(call[1]).toEqual({ email: 'test@correo.com' });
    expect(call[2]).toBe('POST');
  });

  it('debe mostrar el enlace para iniciar sesión', () => {
    render(
      <BrowserRouter>
        <Forgot />
      </BrowserRouter>
    );

    expect(screen.getByText('Inicia Sesión')).toHaveAttribute('href', '/login');
  });

  it('debe mostrar los enlaces del footer', () => {
    render(
      <BrowserRouter>
        <Forgot />
      </BrowserRouter>
    );

    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText('Documentación')).toBeInTheDocument();
    expect(within(footer).getByText('Privacidad')).toBeInTheDocument();
    expect(within(footer).getByText('Términos')).toBeInTheDocument();
    expect(within(footer).getByText('Soporte')).toBeInTheDocument();
  });
});
