import { classNames } from '@/utils';
import { Link, To } from 'react-router-dom';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  intent?: 'primary' | 'secondary' | 'danger';
  className?: string;
  href?: To;
  children: React.ReactNode;
} & React.ComponentProps<'button'>;

const Button: React.FC<Props> = ({ size, intent, className = '', disabled, href, children }) => {
  const classes = classNames(
    intent === 'primary'
      ? 'bg-primary-300'
      : intent === 'secondary'
      ? 'bg-secondary-300'
      : intent == 'danger'
      ? 'bg-danger-300'
      : '',
    size === 'sm' ? 'py-1 px-2 text-sm' : size === 'lg' ? 'py-3 px-6' : 'py-2 px-4',
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80',
    'border border-black shadow-md',
    href ? 'inline-block' : 'block',
    className,
  );
  return (
    <>
      {href ? (
        <Link to={href} className={classes}>
          {children}
        </Link>
      ) : (
        <button className={classes}>{children}</button>
      )}
    </>
  );
};

export default Button;
