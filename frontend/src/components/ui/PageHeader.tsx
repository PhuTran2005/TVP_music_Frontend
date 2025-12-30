import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div className="space-y-1">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
