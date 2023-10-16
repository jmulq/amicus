import { classNames } from '@/utils';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import Label from './Label';

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'password' | 'number' | 'time' | 'email' | 'hidden';
  validation?: RegisterOptions;
  detached?: boolean;
} & React.ComponentProps<'input'>;

const Input: React.FC<Props> = ({
  detached,
  name,
  type,
  validation,
  label,
  className = '',
  readOnly,
  required,
}) => {
  const { register, formState } = useFormContext() ?? {};
  const { errors, touchedFields } = formState ?? {};
  const isTouched = touchedFields?.[name];
  const hasError = !!errors?.[name] && isTouched;
  return (
    <div>
      {label && (
        <Label name={name} required={required} readOnly={readOnly}>
          {label}
        </Label>
      )}
      <input
        name={name}
        type={type}
        readOnly={readOnly}
        {...(detached ? {} : register(name, validation))}
        className={classNames(
          'border-b border-primary-300 overflow-hidden focus:ring-0 focus:outline-none px-4 py-2 ',
          className,
        )}
      />
      {hasError && (
        <div className='mb-1 text-sm text-red-400'>{errors[name]?.message as string}</div>
      )}
    </div>
  );
};

export default Input;
