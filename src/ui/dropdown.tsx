import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Button from "./button";
import { ButtonProps } from "./button";
import { BiLinkExternal } from "react-icons/bi";
import { cn } from "@/utils/cn";

interface DropdownProps extends ButtonProps {
  title?: string;
  external?: boolean;
  onClick?: () => void;
  menuButtonComponent?: React.ReactNode;
  popUpDirection?: "left" | "right";
}

export const Dropdown = ({
  title,
  external,
  onClick,
  menuButtonComponent,
  popUpDirection = "left",
  className,
  icon,
  children,
}: DropdownProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Button} className={className} icon={icon}>
        {menuButtonComponent ?? title}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            "absolute z-40 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md border border-zinc-800 bg-midnight p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            popUpDirection === "left" ? "right-2" : "left-0"
          )}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const DropdownItem = (props: DropdownProps) => {
  return (
    <Menu.Item>
      <div
        className={`relative z-50 block cursor-pointer justify-between rounded px-3 py-2 text-sm text-stone-200 duration-200 hover:bg-midnightLight
        ${props.className}`}
        onClick={props.onClick}
      >
        <div className="flex items-center">
          {props.icon && <div className="mr-3">{props.icon}</div>}
          {props.children}
          {props.external && (
            <div className="ml-2">
              <BiLinkExternal size={12} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </Menu.Item>
  );
};
