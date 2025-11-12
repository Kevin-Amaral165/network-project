// Libraries
import { render, screen, fireEvent } from '@testing-library/react';

// Components
import { Button } from '../button/button';

describe('Button component', (): void => {
  it('should render the text passed as children', (): void => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('should apply the CSS class passed via className', () => {
    render(<Button className="button-test">Click</Button>);
    const button = screen.getByRole('button', { name: /click/i });
    expect(button).toHaveClass('button-test');
  });

  it('should call the "onClick" function when the button is clicked', (): void => {
    const handleClick: jest.Mock = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button', { name: /Click/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should disable the button when "disabled" is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button: HTMLElement = screen.getByRole('button', { name: /Disabled/i });
    expect(button).toBeDisabled();
  });

  it('should not call "onClick" if the button is disabled', (): void => {
    const handleClick: jest.Mock = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    fireEvent.click(screen.getByRole('button', { name: /Disabled/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
