import { type FormHTMLAttributes } from 'react';
import { cn } from '~/utils';

import { TextInput } from './TextInput';
import { TextArea } from './TextArea';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

const Form = ({ children, className, onSubmit, ...props }: FormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      className={cn('space-y-4', className)}
      onSubmit={handleSubmit}
      method="post"
      {...props}
    >
      {children}
    </form>
  );
};

Form.TextInput = TextInput;
Form.TextArea = TextArea;

export { Form };
