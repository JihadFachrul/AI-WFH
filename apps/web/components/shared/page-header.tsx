export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
