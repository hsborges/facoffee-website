import classNames from 'classnames';
import Link from 'next/link';
import { HTMLAttributes } from 'react';
import { BiSolidCoffeeBean } from 'react-icons/bi';

export type LogoProps = HTMLAttributes<HTMLElement> & {
  horizontal?: boolean;
  size?: 'normal' | 'lg';
  variant?: 'normal' | 'white';
  link?: string;
};

export default function Logo(props: LogoProps) {
  const colors =
    props.variant === 'normal'
      ? { primary: 'text-primary', secondary: 'text-primary-alt' }
      : { primary: 'text-white', secondary: 'text-primary-alt' };

  const textSize = props.size == 'normal' ? 'text-xl' : 'text-2xl';

  const Wraper = props.link ? Link : 'span';

  return (
    <span className={classNames('flex justify-center font-extrabold', textSize, props.className)}>
      <Wraper
        href={props.link || '/'}
        className={classNames('flex items-center gap-1', props.horizontal && 'flex-col gap-0')}
      >
        <BiSolidCoffeeBean
          className={colors.secondary}
          style={{ fontSize: props.horizontal ? '1.5em' : '1.25em' }}
        />
        <span className={classNames(colors.secondary, 'tracking-wide')}>
          FA
          <span className={colors.primary}>COFFEE</span>
        </span>
      </Wraper>
    </span>
  );
}
