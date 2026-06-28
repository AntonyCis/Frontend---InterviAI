import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router';
import Reset from './Reset';

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

describe('Reset password page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderReset = () =>
    render(
      <MemoryRouter initialEntries={['/recuperarpassword/fake-reset-token-123']}>
        <Routes>
          <Route path="recuperarpassword/:token" element={<Reset />} />
        </Routes>
      </MemoryRouter>
    );

  it('debe verificar el token al montar el componente', async () => {
    mockFetchDataBackend.mockResolvedValue({ msg: 'Token confirmado' });
    renderReset();

    await waitFor(() => {
      expect(mockFetchDataBackend).toHaveBeenCalledWith(
        expect.stringContaining('/recuperar-password/fake-reset-token-123'),
        'GET'
      );
    });
  });

  it('debe mostrar el formulario de nueva contraseña tras validar el token', async () => {
    mockFetchDataBackend.mockResolvedValue({ msg: 'Token confirmado' });
    renderReset();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cambiar contraseña/i })).toBeInTheDocument();
    });

    expect(screen.getAllByPlaceholderText('••••••••').length).toBeGreaterThanOrEqual(1);
  });

  it('debe enviar nueva contraseña al backend', async () => {
    mockFetchDataBackend.mockResolvedValue({ msg: 'Felicitaciones' });
    renderReset();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cambiar contraseña/i })).toBeInTheDocument();
    });

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'nuevapass123' } });
    fireEvent.change(inputs[1], { target: { value: 'nuevapass123' } });

    fireEvent.click(screen.getByRole('button', { name: /cambiar contraseña/i }));

    await waitFor(() => {
      expect(mockFetchDataBackend).toHaveBeenCalledWith(
        expect.stringContaining('/nuevo-password/fake-reset-token-123'),
        { password: 'nuevapass123', confirmpassword: 'nuevapass123' },
        'POST'
      );
    });
  });

  it('debe mostrar los enlaces del footer', async () => {
    mockFetchDataBackend.mockResolvedValue({ msg: 'Token confirmado' });
    renderReset();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cambiar contraseña/i })).toBeInTheDocument();
    });

    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText('Documentación')).toBeInTheDocument();
    expect(within(footer).getByText('Privacidad')).toBeInTheDocument();
    expect(within(footer).getByText('Términos')).toBeInTheDocument();
    expect(within(footer).getByText('Soporte')).toBeInTheDocument();
  });
});
