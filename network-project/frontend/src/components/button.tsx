import { Button as AntButton } from 'antd';
import { ReactNode, MouseEventHandler } from 'react';

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';  // estilo visual
  htmlType?: 'button' | 'submit' | 'reset';                   // tipo HTML do botão
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  children,
  className,
  type = 'default',
  htmlType = 'button',
  loading = false,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <AntButton
      className={className}
      type={type}       // estilo do botão (cor)
      htmlType={htmlType}  // tipo do botão (submit, button, reset)
      loading={loading}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </AntButton>
  );
}
