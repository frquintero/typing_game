import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('merges custom className with base and variant classes', () => {
    render(
      <Button className="bg-red-600 custom-class">Click me</Button>
    );

    const button = screen.getByRole('button', { name: 'Click me' });

    // Base classes should be present
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('rounded');
    expect(button).toHaveClass('font-medium');
    expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');

    // Variant (primary) classes should be present too
    expect(button).toHaveClass('bg-blue-500');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('hover:bg-blue-600');
    expect(button).toHaveClass('focus:ring-blue-500');

    // And the custom classes should be appended (can override Tailwind styles)
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('custom-class');
  });

  it('defaults type to button', () => {
    render(<Button>Type default</Button>);
    const button = screen.getByRole('button', { name: 'Type default' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies dark-mode friendly styles for secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: 'Secondary' });

    // Light mode classes
    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-800');
    expect(button).toHaveClass('hover:bg-gray-300');
    expect(button).toHaveClass('focus:ring-gray-500');

    // Dark mode classes
    expect(button).toHaveClass('dark:bg-gray-700');
    expect(button).toHaveClass('dark:text-gray-200');
    expect(button).toHaveClass('dark:hover:bg-gray-600');
    expect(button).toHaveClass('dark:focus:ring-gray-400');
  });
});
