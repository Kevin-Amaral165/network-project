import { Button as AntButton } from 'antd';
import { ButtonProps } from './types';

export function Button({ children, ...rest }: ButtonProps) {
  return (
    <AntButton
      {...rest}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </AntButton>
  );
}
