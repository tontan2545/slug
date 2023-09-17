import AppLayout from "@/layout/app";
import { MdOutlineBuildCircle } from "react-icons/md";
import React from "react";

const Tree = () => {
  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-250px)] w-full items-center justify-center text-white/80">
        <div className="flex flex-col items-center justify-center space-y-4">
          <MdOutlineBuildCircle size={60} />
          <h1 className="text-2xl">This page is under construction</h1>
        </div>
      </div>
    </AppLayout>
  );
};

export default Tree;
