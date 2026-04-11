type Props = {
  name: string;
  className?: string;
};

export default function AppIcon({ name, className }: Props) {
  return (
    <span className={className}>
      {name === 'home' && '🏠'}
      {name === 'error' && '❌'}
      {name === 'order' && '📦'}
    </span>
  );
}