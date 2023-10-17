type LabelProps = {
  name: string;
  required?: boolean;
  readOnly?: boolean;
} & React.ComponentProps<'label'>;

export const Label: React.FC<LabelProps> = ({ name, required, readOnly, children }) => {
  return (
    <div className='flex justify-between text-neutral-500'>
      <label htmlFor={name} className='mb-2 flex font-medium capitalize'>
        {children}:{required && <span className='text-red-400'>*</span>}
      </label>
      {readOnly && (
        <span className='text-sm text-neutral-500'>[Read Only]</span>
      )}
    </div>
  );
};

export default Label;
