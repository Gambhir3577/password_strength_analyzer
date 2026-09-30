import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from '../../components/analyzer/PasswordInput';

describe('PasswordInput Component', () => {
  it('renders input with password type by default and security attributes', () => {
    render(<PasswordInput value="test123" onChange={() => {}} />);
    const input = screen.getByDisplayValue('test123') as HTMLInputElement;

    expect(input.type).toBe('password');
    expect(input.getAttribute('autocomplete')).toBe('new-password');
    expect(input.getAttribute('spellcheck')).toBe('false');
    expect(input.getAttribute('data-lpignore')).toBe('true');
  });

  it('toggles password visibility when show/hide button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput value="secretPassword!" onChange={() => {}} />);

    const toggleBtn = screen.getByTitle('Show password');
    const input = screen.getByDisplayValue('secretPassword!') as HTMLInputElement;

    expect(input.type).toBe('password');

    await user.click(toggleBtn);
    expect(input.type).toBe('text');

    const hideBtn = screen.getByTitle('Hide password');
    await user.click(hideBtn);
    expect(input.type).toBe('password');
  });

  it('triggers onChange when user types', async () => {
    const handleChange = vi.fn();
    render(<PasswordInput value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Type or paste password here...');
    fireEvent.change(input, { target: { value: 'mypassword' } });

    expect(handleChange).toHaveBeenCalledWith('mypassword');
  });

  it('clears password on clear button click', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<PasswordInput value="existingPassword" onChange={handleChange} />);

    const clearBtn = screen.getByTitle('Clear password');
    await user.click(clearBtn);

    expect(handleChange).toHaveBeenCalledWith('');
  });
});
