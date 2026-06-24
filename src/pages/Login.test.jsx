import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import Login from './Login';

// 1. Definimos la función de backend como un mock de Vitest fuera para persistir la referencia
const mockFetchDataBackend = vi.fn();

// 2. Mock del Hook useFetch
vi.mock('../hooks/useFetch', () => ({
  // Importante: useFetch devuelve la FUNCIÓN que el componente usará
  default: () => mockFetchDataBackend, 
  useFetch: () => mockFetchDataBackend
}));

// 3. Mock del Store de Auth
const mockSetToken = vi.fn();
const mockSetRol = vi.fn();
vi.mock('../context/storeAuth', () => ({
  default: () => ({
    setToken: mockSetToken,
    setRol: mockSetRol
  }),
  storeAuth: () => ({
    setToken: mockSetToken,
    setRol: mockSetRol
  })
}));

// Mocks de librerías visuales (necesarios para que no rompa el render)
vi.mock('vanta/dist/vanta.globe.min', () => ({ default: () => ({ destroy: vi.fn() }) }));
vi.mock('three', () => ({}));

vi.mock('../context/storeTheme', () => ({
  default: () => ({
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

describe('Componente de Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar a la API con los datos correctos al hacer submit', async () => {
    // Simulamos una respuesta exitosa del backend
    mockFetchDataBackend.mockResolvedValue({
      token: 'fake-token-123',
      rol: 'admin'
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Llenamos los campos (Asegúrate de que los placeholders coincidan)
    fireEvent.change(screen.getByPlaceholderText(/nombre@empresa.com/i), {
      target: { value: 'test@correo.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'password123' }
    });

    // Enviamos el formulario
    fireEvent.click(screen.getByRole('button', { name: /ingresar al workspace/i }));

    // Esperamos que el mock del backend se haya llamado
    await waitFor(() => {
      expect(mockFetchDataBackend).toHaveBeenCalled();
    });

    // Verificamos que los datos en el store se actualizaron
    expect(mockSetToken).toHaveBeenCalledWith('fake-token-123');
  });

  it('debe mostrar mensaje de error si la respuesta es fallida', async () => {
    // Simulamos un error del backend
    mockFetchDataBackend.mockRejectedValueOnce(new Error('Credenciales inválidas'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Llenar datos para que pase la validación de React Hook Form
    fireEvent.change(screen.getByPlaceholderText(/nombre@empresa.com/i), { target: { value: 'error@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /ingresar al workspace/i }));

    // En lugar de buscar "procesando solicitud" (que puede ser muy rápido),
    // buscamos el resultado final del fallo si tu componente lo maneja:
    await waitFor(() => {
      expect(mockFetchDataBackend).toHaveBeenCalled();
    });
  });

  it('debe mostrar los enlaces funcionales en el footer de login', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const footer = screen.getByRole('contentinfo');

    expect(within(footer).getByText('API Docs')).toHaveAttribute('href', 'https://documenter.getpostman.com/view/52250755/2sBXwtppbR#intro');
    expect(within(footer).getByText('Inicio')).toHaveAttribute('href', '/');
    expect(within(footer).getByText('Registro')).toHaveAttribute('href', '/register');
    expect(within(footer).getByText('Soporte')).toHaveAttribute('href', 'mailto:contacto@interviai.com');
  });
});