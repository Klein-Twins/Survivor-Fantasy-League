export const MainBackgroundColor =
  ' dark:bg-surface-a0-dark bg-surface-a0-light';

export const NavBarColor = 'dark:bg-surface-a3-dark bg-surface-a3-light';
export const PanelBackgroundColor =
  'dark:bg-surface-a3-dark bg-surface-a1-light';
export const ElementBackgroundColor =
  'dark:bg-surface-a2-dark bg-surface-a2-light';
export const ElementBackgroundColorWithHover = ElementBackgroundColor.concat(
  ' dark:hover:bg-surface-a3-dark hover:bg-surface-a3-light'
);
export const InputBackgroundColor =
  'dark:bg-surface-a5-dark bg-surface-a0-light';

export const TextPrimaryColor =
  'dark:text-primary-a0-dark text-primary-a0-light';
export const TextPrimarySelectedColor =
  'dark:text-primary-a1-dark text-primary-a1-light';
export const HoverTextPrimarySelectedColor =
  TextPrimarySelectedColor +
  'hover:dark:text-primary-a2-dark hover:text-primary-a2-light';
export const MainBackgroundColors =
  MainBackgroundColor.concat(' ').concat(TextPrimaryColor);
export const TextSecondaryColor =
  'dark:text-primary-a1-dark text-primary-a1-light';
export const TextTertiaryColor =
  'dark:text-primary-a2-dark text-primary-a2-light';
export const TextQuaternaryColor =
  'dark:text-primary-a3-dark text-primary-a3-light';
export const TextPenteraryColor =
  'dark:text-primary-a4-dark text-primary-a4-light';

export const ButtonPrimaryBgColor = `
  dark:bg-primary-a3-dark 
  dark:hover:enabled:bg-primary-a2-dark 
  bg-primary-a3-light 
  hover:enabled:bg-primary-a2-light 
  disabled:dark:bg-primary-a3-dark 
  disabled:bg-primary-a3-light
  disabled:opacity-50
`;

export const ButtonCheckColors = `
  dark:text-primary-a3-dark 
  dark:hover:enabled:text-primary-a2-dark 
  hover:enabled:text-primary-a2-light 
  disabled:dark:text-primary-a3-dark 
  disabled:text-primary-a3-light
  disabled:opacity-50
`;
export const ButtonXColors = `
  dark:border-primary-a3-dark 
  dark:hover:text-primary-a3-dark 
  border-primary-a3-light 
  hover:text-primary-a3-light
`;

export const ButtonPrimaryTextColor = 'dark:text-white text-primary-a0-light';
export const ButtonPrimaryColors = `${ButtonPrimaryBgColor} ${ButtonPrimaryTextColor}`;

export const ButtonSubtleBgColor =
  'dark:border-primary-a3-dark dark:hover:bg-primary-a3-dark border-primary-a3-light hover:bg-primary-a3-light';
export const ButtonSubtleTextColor =
  'dark:text-primary-a3-dark dark:hover:text-white text-primary-a1-light hover:text-primary-a0-light';
export const ButtonSubtleColors = `${ButtonSubtleBgColor} ${ButtonSubtleTextColor}`;

export const LinkButtonColors = TextPrimaryColor;

export const HorizontalLinePrimaryColors =
  'border dark:border-primary-a0-dark border-primary-a0-light';
export const HorizontalLineMutedColors =
  'border dark:border-primary-a5-dark border-primary-a4-light';

export const ModalColors =
  'dark:bg-surface-a1-dark dark:text-primary-a3-dark bg-surface-a1-light text-primary-a3-light';

export const TextErrorColor = 'dark:text-red-500 text-red-500';
export const InputErrorColors =
  'dark:border-red-300 border-red-300 text-red-300 dark:text-red-300';
