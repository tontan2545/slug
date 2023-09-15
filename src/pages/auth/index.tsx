import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { toastStyles } from "@/styles/toast";
import { Button } from "@/ui";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { signIn } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsGithub, BsGoogle } from "react-icons/bs";

const Auth = () => {
  const [loading, setLoading] = useState<BuiltInProviderType | null>(null);

  const handleSignIn = (provider: BuiltInProviderType) => async () => {
    setLoading(provider);
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      toast(
        "An error occurred while logging in. Please create an issue about the problem.",
        {
          icon: "🤔",
          style: toastStyles,
        }
      );
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mt-16 flex flex-col items-center justify-center px-4">
        <h1 className="mb-8 text-4xl">👋 Welcome</h1>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Button
            className="ml-4 w-full justify-center bg-midnightLight"
            onClick={handleSignIn("github")}
            isLoading={loading === "github"}
            loadingText="Loading..."
            icon={<BsGithub size={17} />}
          >
            Sign in with GitHub
          </Button>
          <Button
            className="ml-4 w-full justify-center bg-midnightLight"
            onClick={handleSignIn("google")}
            isLoading={loading === "google"}
            loadingText="Loading..."
            icon={<BsGoogle size={17} />}
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Auth;
