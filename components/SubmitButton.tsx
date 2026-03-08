import Image from "next/image";

import { Button } from "./ui/button";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
}

const SubmitButton = ({ isLoading, className, style, children, type = "submit", onClick }: ButtonProps) => {
  return (
    <Button
      type={type}
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
      style={style}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
