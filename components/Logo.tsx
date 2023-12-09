import { HTMLAttributes } from 'react';
import { BiSolidCoffeeBean } from 'react-icons/bi';

export type LogoProps = HTMLAttributes<HTMLElement> & {
  horizontal?: boolean;
  size?: 'normal' | 'lg';
};

const scales: Record<'normal' | 'lg', number> = { normal: 1, lg: 2 };

export default function Logo({ horizontal, size, ...props }: LogoProps) {
  return (
    <span
      {...props}
      className={
        `font-extrabold text-primary flex items-center gap-1 text-${scales[size || 'normal']}xl` +
        (horizontal ? ' flex-col gap-0 ' : ' ') +
        (props.className || ' ')
      }
    >
      <BiSolidCoffeeBean
        className="text-primary-alt"
        style={{ fontSize: horizontal ? '1.5em' : '1.25em' }}
      />
      <span className="text-primary-alt">
        FA
        <span className="text-primary">COFFEE</span>
      </span>
    </span>
  );
}
