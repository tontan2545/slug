import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import Auth from "@/components/auth";
import IconButton from "@/ui/iconButton";
import CommandMenu from "../command";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-midnight py-4 duration-300">
      <div className="container mx-auto flex items-center justify-between pl-4 pr-4 md:pl-0 md:pr-0">
        <Link href="/">
          <div className="flex cursor-pointer items-center text-white transition-all hover:text-gray-300">
            <img src="/img/logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="ml-2 mr-2 text-xl">nkaewamporn</h1>
          </div>
        </Link>
        <div className="flex items-center space-x-6">
          <Auth />
          <CommandMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
