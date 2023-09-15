import type { NextPage } from "next";

import Up from "@/motions/up";
import { BiRocket } from "react-icons/bi";
import LinkRoute from "@/ui/linkRoute";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r pt-20 pb-20 transition-all duration-100">
      <Up>
        <h1 className="mb-2 text-3xl md:mb-5 md:text-6xl">Link Shortener</h1>
      </Up>
      <Up delay={0.2}>
        <h3 className="mb-6 text-2xl text-gray-400">
          unlimited links & custom slugs
        </h3>
      </Up>
      <Up delay={0.4}>
        <div className="flex rounded-md px-1 hover:bg-zinc-800">
          <LinkRoute href="/dashboard">
            <BiRocket className="mr-2" />
            Get Started
          </LinkRoute>
        </div>
      </Up>
    </div>
  );
};

export default Home;
