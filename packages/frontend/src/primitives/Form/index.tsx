import { type FormHTMLAttributes } from 'react';

import { TextInput } from './TextInput';
import { TextArea } from './TextArea';
import { DropdownInput } from './Dropdown';
import { SliderInput } from './Slider';

type FormProps = FormHTMLAttributes<HTMLFormElement>;

const Form = ({ children, onSubmit, ...props }: FormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form onSubmit={handleSubmit} method="post" {...props}>
      {children}
    </form>
  );
};

Form.TextInput = TextInput;
Form.TextArea = TextArea;
Form.Dropdown = DropdownInput;
Form.Slider = SliderInput;

export { Form };
