import { cn } from "@/utils/cn";
import { ComponentProps, FC } from "react";

const Input: FC<ComponentProps<"input">> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "mt-1 w-full rounded-md bg-midnightLight px-4 py-2 text-white transition duration-200 ease-in-out focus:border-none focus:outline-none focus:ring-1 focus:ring-neutral-500",
        className
      )}
      {...props}
    />
  );
};

export default Input;
