import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-primary-foreground font-bold text-lg",
        className
      )}
    >
      <div
        className="p-2 bg-primary rounded-md"
        style={{
          filter: "drop-shadow(0 0 0.75rem hsl(var(--primary) / 0.5))",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-foreground"
        >
          <path
            d="M9 12L5 9L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 12L19 9L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 21V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 9V3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-headline">GeekForce Central</span>
    </div>
  );
};

export default Logo;
