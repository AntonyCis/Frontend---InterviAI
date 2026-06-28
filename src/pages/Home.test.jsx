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

  it('debe renderizar la sección hero con el botón Comenzar Ahora', () => {
    render(<Home />);

    expect(screen.getByText('Comenzar Ahora')).toBeInTheDocument();
    expect(screen.getByText(/Prepárate para tu Próxima Entrevista Técnica/i)).toBeInTheDocument();
  });

  it('debe redirigir a /register al hacer click en Comenzar Ahora', () => {
    render(<Home />);

    const boton = screen.getByText('Comenzar Ahora');
    fireEvent.click(boton);

    expect(window.location.href).toBe('/register');
  });

  it('debe mostrar los enlaces funcionales en el footer', () => {
    render(<Home />);

    const footer = screen.getByRole('contentinfo');

    expect(within(footer).getByText('Funcionalidades')).toHaveAttribute('href', '#funcionalidades');
    expect(within(footer).getByText('Cómo funciona')).toHaveAttribute('href', '#como-funciona');
    expect(within(footer).getByText('Soporte')).toHaveAttribute('href', 'mailto:contacto@interviai.com');
  });
});
