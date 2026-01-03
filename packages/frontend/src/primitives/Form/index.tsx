import { cn } from '~/utils';

import { TextInput } from './TextInput';
import { TextArea } from './TextArea';

interface FormProps {
  children: React.ReactNode;
  className?: string;
}

const Form = ({ children, className }: FormProps) => {
  return <form className={cn('space-y-4', className)}>{children}</form>;
};

Form.TextInput = TextInput;
Form.TextArea = TextArea;

export { Form };
