import { avatarColor, cn, initials } from "@/lib/utils";

export function AvatarInitials({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { bg, text } = avatarColor(name);
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-14 w-14 text-base",
  };
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold",
        bg,
        text,
        sizes[size],
        className
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
