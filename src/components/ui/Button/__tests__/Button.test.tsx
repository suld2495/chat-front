import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { Button } from '../Button'

describe('button', () => {
  describe('structure & Rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('renders with default variant (primary)', () => {
      render(<Button>Primary Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-action-primary')
    })

    it('applies all variant styles correctly', () => {
      const variants: Array<'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'> = [
        'primary',
        'secondary',
        'ghost',
        'outline',
        'danger',
      ]

      variants.forEach((variant) => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>)
        const button = screen.getByRole('button')

        // 각 variant의 주요 클래스 확인
        const expectedClasses: Record<typeof variant, string> = {
          primary: 'bg-action-primary',
          secondary: 'bg-action-secondary',
          ghost: 'bg-transparent',
          outline: 'border',
          danger: 'bg-action-destructive',
        }

        expect(button).toHaveClass(expectedClasses[variant])
        unmount()
      })
    })

    it('applies all size styles correctly', () => {
      const sizes: Record<'sm' | 'md' | 'lg', string> = {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
      }

      Object.entries(sizes).forEach(([size, expectedClass]) => {
        const { unmount } = render(
          <Button size={size as 'sm' | 'md' | 'lg'}>{size}</Button>,
        )
        expect(screen.getByRole('button')).toHaveClass(expectedClass)
        unmount()
      })
    })

    it('applies fullWidth class when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>)
      expect(screen.getByRole('button')).toHaveClass('w-full')
    })

    it('merges custom className with default classes', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('rounded-lg') // Default class should still be present
    })

    it('renders as button element by default', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })
  })

  describe('interaction & Events', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Click me</Button>)
      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(
        <Button
          disabled
          onClick={handleClick}
        >
          Disabled
        </Button>,
      )

      // Try to click the disabled button
      await user.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('supports keyboard interaction (Enter)', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Keyboard Button</Button>)

      const button = screen.getByRole('button')
      button.focus()

      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('supports keyboard interaction (Space)', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Button onClick={handleClick}>Space Button</Button>)

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('can be focused and blurred', () => {
      render(<Button>Focus me</Button>)
      const button = screen.getByRole('button')

      button.focus()
      expect(button).toHaveFocus()

      button.blur()
      expect(button).not.toHaveFocus()
    })
  })

  describe('states & Props', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button')

      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('is not disabled by default', () => {
      render(<Button>Enabled Button</Button>)
      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('applies disabled styles', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('disabled')
      expect(button).toHaveClass('disabled:cursor-not-allowed')
    })
  })

  describe('accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('is keyboard accessible', () => {
      render(<Button>Tab to me</Button>)
      const button = screen.getByRole('button')

      // Button should be focusable
      expect(button).not.toHaveAttribute('tabIndex', '-1')
    })

    it('has accessible name from children', () => {
      render(<Button>Submit Form</Button>)
      expect(screen.getByRole('button')).toHaveAccessibleName('Submit Form')
    })

    it('respects aria-label', () => {
      render(<Button aria-label="Custom Label">Button</Button>)
      expect(screen.getByRole('button')).toHaveAccessibleName('Custom Label')
    })
  })

  describe('edge Cases', () => {
    it('handles undefined onClick gracefully', () => {
      expect(() => {
        render(<Button>No handler</Button>)
      }).not.toThrow()
    })

    it('handles empty children', () => {
      render(<Button></Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('handles number as children', () => {
      render(<Button>{42}</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('42')
    })

    it('handles multiple className values', () => {
      render(<Button className="class-1 class-2 class-3">Multiple Classes</Button>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('class-1')
      expect(button).toHaveClass('class-2')
      expect(button).toHaveClass('class-3')
    })
  })

  describe('variant + Size Combinations', () => {
    it('correctly combines variant and size classes', () => {
      render(
        <Button
          variant="primary"
          size="sm"
        >
          Primary Small
        </Button>,
      )
      const button = screen.getByRole('button')

      expect(button).toHaveClass('bg-action-primary')
      expect(button).toHaveClass('h-8')
    })

    it('works with all combinations', () => {
      const variants: Array<'primary' | 'secondary'> = ['primary', 'secondary']
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { unmount } = render(
            <Button
              variant={variant}
              size={size}
            >
              {variant}
              -
              {size}
            </Button>,
          )

          const button = screen.getByRole('button')
          expect(button).toBeInTheDocument()

          unmount()
        })
      })
    })
  })
})
