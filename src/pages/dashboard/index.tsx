import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { useForm } from "react-hook-form";
import { LinkSchema } from "@/schema/link.schema";

import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { BsList } from "react-icons/bs";

import { Tab } from "@headlessui/react";

import { FilterLinkInput } from "@/schema/link.schema";

import Loader from "@/motions/loader";
import Card from "@/components/card";
import DashboardLayout from "@/layout/app";

import { BiPlus, BiRocket } from "react-icons/bi";

import Alert from "@/ui/alert";
import LinkRoute from "@/ui/linkRoute";
import { Button, Input } from "@/ui";
import { cn } from "@/utils/cn";
import AppLayout from "@/layout/app";
import { useRouter } from "next/router";

const Dashboard = () => {
  const { register } = useForm<FilterLinkInput>();
  const [filter, setFilter] = useState("");
  const [links, setLinks] = useState<LinkSchema[]>([]);
  const [searchLinks, setSearchLinks] = useState("");

  const router = useRouter();

  // const viewToggle = [
  //   { icon: HiOutlineSquares2X2, value: "GRID" },
  //   {
  //     icon: BsList,
  //     value: "LIST",
  //   },
  // ];

  const {
    data: linksData,
    isLoading,
    error,
  } = trpc.links.allLinks.useQuery({
    filter,
  });

  if (error) {
    return (
      <Alert>
        <p>{error.message}</p>
      </Alert>
    );
  }

  const filteredLinks = linksData?.filter((link) => {
    return (
      link.slug.toLowerCase().includes(searchLinks.toLowerCase()) ||
      link.name.toLowerCase().includes(searchLinks.toLowerCase())
    );
  });

  if (!linksData) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center">
        <p className="mb-2">Loading your links...</p>
        <Loader />
      </div>
    );
  }

  if (links.length === 0 && linksData.length > 0) {
    setLinks(linksData as LinkSchema[]);
  }

  const handleNavigateToCreate = () => {
    router.push("/dashboard/create");
  };

  return (
    <AppLayout>
      <div className="mt-6 space-y-4">
        <div className="flex w-full items-center justify-center space-x-2">
          <Input
            id="filter"
            type="text"
            placeholder="Search links"
            {...register("filter")}
            onChange={(e) => {
              setSearchLinks(e.target.value);
            }}
            className="mt-0"
          />
          <Button
            className="flex h-full items-center justify-center"
            onClick={handleNavigateToCreate}
          >
            <BiPlus className="mr-1" />
            <p className="w-max text-stone-200">Create Link</p>
          </Button>
        </div>
        {/* WIP Toggle */}
        {/* <div className="flex justify-end">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-lg bg-slate-900/20 p-1">
              {viewToggle.map((view) => (
                <Tab
                  key={view.value}
                  className={({ selected }) =>
                    cn(
                      "flex rounded-md px-3 py-1 text-sm font-medium text-black",
                      "ring-white ring-opacity-60 ring-offset-1 ring-offset-slate-400 focus:outline-none focus:ring-1",
                      selected
                        ? "bg-white"
                        : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                >
                  <view.icon size={22} />
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div> */}
        {links.length === 0 && (
          <div className="mt-5 flex flex-col items-center justify-center">
            <BiRocket className="mb-4 text-gray-400" size={64} />
            <p className="mb-4 text-xl">Lets create your first link!</p>
            <LinkRoute
              href="/dashboard/create"
              className="border border-gray-400"
            >
              Create a link
            </LinkRoute>
          </div>
        )}
        {isLoading && (
          <>
            <div className="mt-8 flex flex-col items-center justify-center">
              <p className="mb-2">Loading your links...</p>
              <Loader />
            </div>
          </>
        )}
        {links && (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLinks?.map((link, index) => (
              <Card key={link.id} link={link} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Dashboard;
