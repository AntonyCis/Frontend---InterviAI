import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from './Home';

vi.mock('../context/storeTheme', () => ({
  default: () => ({
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

describe('Home page', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('debe renderizar la sección hero con el botón Iniciar Simulación', () => {
    render(<Home />);

    expect(screen.getByText('Iniciar Simulación')).toBeInTheDocument();
    expect(screen.getByText(/Domina el Arte de la Entrevista Técnica/i)).toBeInTheDocument();
  });

  it('debe redirigir a /login al hacer click en Iniciar Simulación', () => {
    render(<Home />);

    const boton = screen.getByText('Iniciar Simulación');
    fireEvent.click(boton);

    expect(window.location.href).toBe('/login');
  });

  it('debe mostrar los enlaces funcionales en el footer', () => {
    render(<Home />);

    const footer = screen.getByRole('contentinfo');

    expect(within(footer).getByText('Misión')).toHaveAttribute('href', '#mision');
    expect(within(footer).getByText('Servicios')).toHaveAttribute('href', '#servicios');
    expect(within(footer).getByText('Soporte')).toHaveAttribute('href', 'mailto:contacto@interviai.com');
    expect(within(footer).getByText('API Docs')).toHaveAttribute('href', 'https://documenter.getpostman.com/view/52250755/2sBXwtppbR#intro');
  });
});
