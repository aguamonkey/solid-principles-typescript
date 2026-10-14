export function ErrorDisplay({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div role="alert" className="notice">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}
