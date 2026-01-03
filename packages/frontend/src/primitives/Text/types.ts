type BaseTextProps = {
  children: React.ReactNode;
  className?: string;
};

export type PVariant = 'default' | 'subtitle';

export type TextProps =
  | (BaseTextProps & {
      element?: 'p';
      variant?: PVariant;
    })
  | (BaseTextProps & {
      element?: 'label';
      htmlFor?: string;
    })
  | (BaseTextProps & {
      element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    });
