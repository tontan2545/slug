import { paths } from "@/constants/path";
import { Dropdown, DropdownItem } from "@/ui/dropdown";
import LinkRoute from "@/ui/linkRoute";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";

interface Props {
  children: React.ReactNode;
}

const AppLayout = (props: Props) => {
  const router = useRouter();

  const getPathName = (path: string) => {
    const name = paths.find((p) => p.path === path)?.name;
    return name;
  };

  const name = useMemo(() => getPathName(router.pathname), [router.pathname]);
  return (
    <>
      <div className="mt-1 border-b-2 border-zinc-800">
        <div className="container  mx-auto flex items-center justify-between pl-4 pr-4 pb-3 md:pl-0 md:pr-0">
          <Dropdown
            menuButtonComponent={
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl">{name}</h1>
                <AiFillCaretDown size={15} className="text-white/25" />
              </div>
            }
            popUpDirection="right"
            className="text-2xl"
          >
            {paths.map((path) => (
              <Link href={path.path} key={path.path}>
                <DropdownItem
                  className={
                    path.path === router.pathname ? "bg-midnightLight/80" : ""
                  }
                >
                  {path.name}
                </DropdownItem>
              </Link>
            ))}
          </Dropdown>

          {/* <LinkRoute href="/dashboard/create">
            <BiPlus className="mr-2" />
            Create new link
          </LinkRoute> */}
        </div>
      </div>
      <div className="container mx-auto pl-4 pr-4 md:pl-0 md:pr-0">
        {props.children}
      </div>
    </>
  );
};

export default AppLayout;
