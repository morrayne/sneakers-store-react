import { cn } from "@/utils/cn";

interface Props {
  className?: string;
}

export default function Skeleton({ className }: Props) {
  return <div className={cn("animate-pulse rounded-md bg-bg-tertiary", className)} />;
}
