const PageHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>
      )}
    </div>
    {action && <div className="flex items-center gap-3">{action}</div>}
  </div>
);
export default PageHeader;
