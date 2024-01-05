import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { BiSolidCoffeeBean } from 'react-icons/bi';

export type LogoProps = HTMLAttributes<HTMLElement> & {
  horizontal?: boolean;
  size?: 'normal' | 'lg';
  variant?: 'normal' | 'white';
};

export default function Logo({
  horizontal,
  size = 'normal',
  className,
  variant = 'normal',
}: LogoProps) {
  const colors =
    variant === 'normal'
      ? { primary: 'text-primary', secondary: 'text-primary-alt' }
      : { primary: 'text-white', secondary: 'text-primary-alt' };

  const textSize = size == 'normal' ? 'text-xl' : 'text-2xl';

  return (
    <span
      className={classNames(
        'font-extrabold flex items-center gap-1',
        textSize,
        horizontal && 'flex-col gap-0',
        className,
      )}
    >
      <BiSolidCoffeeBean
        className={colors.secondary}
        style={{ fontSize: horizontal ? '1.5em' : '1.25em' }}
      />
      <span className={classNames(colors.secondary, 'tracking-wide')}>
        FA
        <span className={colors.primary}>COFFEE</span>
      </span>
    </span>
  );
}
