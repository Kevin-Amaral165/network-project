import { Button as AntButton } from 'antd';
import { ButtonProps } from './types';

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