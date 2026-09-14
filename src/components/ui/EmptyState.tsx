import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({ title, description, icon, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-text-tertiary">{icon ?? <SearchX size={48} strokeWidth={1.5} />}</div>
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
