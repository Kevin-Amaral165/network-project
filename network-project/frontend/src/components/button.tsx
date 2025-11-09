import { Button as AntButton } from 'antd';
import { ReactNode } from 'react';

interface ButtonProps {
  className?: string;
  children?: ReactNode;
}

export function Button({
    children,
    className,
}: ButtonProps) {
  return (
    <AntButton className={className}>
      {children}
    </AntButton>
  );
}