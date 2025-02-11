import Header from "@/components/header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <>
      <Header />
      <div className="min-h-auto">{props.children}</div>
    </>
  );
};

export default Layout;
