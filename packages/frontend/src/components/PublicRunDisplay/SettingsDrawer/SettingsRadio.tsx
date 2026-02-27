import { Radio } from '~/primitives';

interface SettingsRadioProps {
  value: string;
  children: string;
}

export const SettingsRadio = (props: SettingsRadioProps) => {
  return (
    <Radio
      {...props}
      className="mb-1 rounded-md px-1 select-none hover:bg-gray-100"
    />
  );
};
