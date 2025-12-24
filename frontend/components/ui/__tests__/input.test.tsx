import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/__tests__/utils/test-utils';
import { Input, Textarea } from '../input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Email" id="email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should show required asterisk when required', () => {
      render(<Input label="Email" required id="email" />);
      const label = screen.getByText('*');
      expect(label).toHaveClass('text-red-500');
    });

    it('should render helper text', () => {
      render(<Input helperText="Enter your email" id="email" />);
      expect(screen.getByText('Enter your email')).toBeInTheDocument();
    });

    it('should apply fullWidth class', () => {
      render(<Input fullWidth />);
      const container = screen.getByRole('textbox').parentElement;
      expect(container).toHaveClass('w-full');
    });
  });

  describe('Error State', () => {
    it('should display error message', () => {
      render(<Input error="Invalid email" id="email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('should apply error styling', () => {
      render(<Input error="Invalid email" id="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('should set aria-invalid when error exists', () => {
      render(<Input error="Invalid email" id="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not show helper text when error exists', () => {
      render(<Input error="Invalid email" helperText="Helper text" id="email" />);
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onChange handler', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should update value on input', async () => {
      const user = userEvent.setup();

      render(<Input />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.type(input, 'test value');

      expect(input.value).toBe('test value');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });
});

describe('Textarea Component', () => {
  describe('Rendering', () => {
    it('should render textarea element', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with custom rows', () => {
      render(<Textarea rows={10} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '10');
    });

    it('should render with label', () => {
      render(<Textarea label="Description" id="desc" />);
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message', () => {
      render(<Textarea error="Description is required" id="desc" />);
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    it('should apply error styling', () => {
      render(<Textarea error="Error" id="desc" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-500');
    });
  });

  describe('Interaction', () => {
    it('should call onChange handler', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'test');

      expect(handleChange).toHaveBeenCalled();
    });
  });
});
