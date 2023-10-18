export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export const truncateAddress = (
  address?: `0x${string}`,
  option?: number | { right?: number; left?: number },
): string => {
  if (!address) return '';
  if (typeof option === 'number') {
    return `${address.slice(0, option)}...${address.slice(-option)}`;
  }

  const { left = 9, right = 9 } = option ?? {};

  if (left + right >= address.length) {
    return address;
  }

  return `${address.slice(0, left)}...${address.slice(-right)}`;
};