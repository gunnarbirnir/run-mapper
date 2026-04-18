import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import type { EditorRun } from '~/types';
import { Form } from '~/primitives';

export interface RunEditorFormValues {
  name: string;
  publicSlug: string;
}

export const getRunEditorFormDefaults = (
  existingRun?: EditorRun,
): RunEditorFormValues => ({
  name: existingRun?.name ?? '',
  publicSlug: existingRun?.publicSlug ?? '',
});

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

interface TextFieldProps {
  label: string;
  placeholder?: string;
  infoText?: string;
}

const TextField = ({ label, placeholder, infoText }: TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <Form.TextInput
      id={field.name}
      name={field.name}
      label={label}
      placeholder={placeholder}
      value={field.state.value}
      onChange={field.handleChange}
      infoText={infoText}
    />
  );
};

export const { useAppForm: useRunEditorForm, withForm: withRunEditorForm } =
  createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
      TextField,
    },
    formComponents: {},
  });
