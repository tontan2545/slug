import { useEffect, useState } from "react";

type Input = string | undefined;

type Output<T> = T extends string
  ? {
      hostUrl: string;
      redirectUrl: string;
    }
  : T extends undefined
  ? {
      hostUrl: string;
    }
  : never;

export const useHostUrl = <T extends Input>(pathName: T): Output<T> => {
  const [hostUrl, setHostUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostUrl(window.location.origin);
    }
  }, []);

  const redirectUrl = pathName && `${hostUrl}/${pathName}`;

  return {
    hostUrl,
    redirectUrl,
  } as Output<T>;
};
