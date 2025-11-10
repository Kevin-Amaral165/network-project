// Core
import { ReactNode, MouseEventHandler } from 'react';

// Libraries
import { Button as AntButton } from 'antd';

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  htmlType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  children,
  className,
  disabled = false,
  htmlType = 'button',
  loading = false,
  onClick,
  type = 'default',
}: ButtonProps) {
  return (
    <AntButton
      className={className}
      disabled={disabled}
      htmlType={htmlType}
      loading={loading}
      onClick={onClick}
      type={type}
    >
      {children}
    </AntButton>
  );
}
