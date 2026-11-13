import { Loader2 } from "lucide-react";
import { Button } from "./button";

interface ActionBtnProps {
  type?: "button" | "submit" | "reset" | undefined;
  loading?: boolean;
  text?: React.ReactNode;
  classname?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  form?: string;
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
}

export default function Actionbtn({
  type,
  loading,
  text,
  classname,
  onClick,
  disabled,
  variant,
  form,
  size,
}: ActionBtnProps) {
  return (
    <Button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`transition-transform ease-in-out duration-300 ${classname}`}
      variant={variant}
      form={form}
      size={size}
    >
      {loading && <Loader2 />} {text}
    </Button>
  );
}
