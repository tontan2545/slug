import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { CreateLinkInput } from "@/schema/link.schema";
import { BiRefresh, BiRocket } from "react-icons/bi";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

import Button from "@/ui/button";
import Alert from "@/ui/alert";
import { toastStyles } from "@/styles/toast";

const Create = () => {
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateLinkInput>();
  const [loading, setLoading] = useState(false);
  const [hostUrl, setHostUrl] = useState("");
  const router = useRouter();

  const { mutate } = trpc.links.createLink.useMutation({
    onSuccess: () => {
      router.push(`/dashboard`);
      setLoading(false);
      toast("Link created successfully", {
        icon: "🥳",
        style: toastStyles,
      });
    },
    onError: () => {
      setLoading(false);
      setError("slug", {
        type: "manual",
        message:
          "Slug already exists. Please try another one or click 'Randomize' button.",
      });
    },
  });

  const onSubmit = (values: CreateLinkInput) => {
    // Check if slug & url are equals to prevent infinite redirect =>
    if (values.slug === values.url) {
      setError("url", {
        type: "manual",
        message: "The URL and the slug cannot be the same",
      });
      return;
    }

    // check if values.url have https:// or http://, if not then add https://
    if (!values.url.includes("https://") && !values.url.includes("http://")) {
      values.url = `https://${values.url}`;
    }

    setLoading(true);
    mutate(values);
  };

  const handleGenerateRandomSlug = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const randomSlug = nanoid(6);
    setValue("slug", randomSlug);
  };

  useEffect(() => {
    if (typeof window !== "undefined") setHostUrl(window.location.origin);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5">
        <label htmlFor="url">Link name:</label>
        <input
          id="url"
          type="text"
          placeholder="Link name"
          className="mt-1 w-full rounded-md bg-midnightLight px-4 py-2 text-white focus:border-none"
          {...register("name", {
            required: {
              value: true,
              message: "Please enter a name.",
            },
          })}
        />
        {errors.name && <Alert className="mt-2">{errors.name.message}</Alert>}
      </div>
      <div className="mb-5">
        <label htmlFor="url">Link URL:</label>
        <input
          id="url"
          type="text"
          placeholder="https://"
          className="mt-1 w-full rounded-md bg-midnightLight px-4 py-2 text-white focus:border-none"
          {...register("url", {
            required: {
              value: true,
              message: "Please enter a URL.",
            },
            minLength: {
              value: 8,
              message:
                "Please enter a valid URL. It should be at least 8 characters long",
            },
          })}
        />
        {errors.url && <Alert className="mt-2">{errors.url.message}</Alert>}
      </div>
      <div className="mb-5">
        <label htmlFor="slug">Custom link path:</label>
        <div className="flex w-full items-center justify-between space-x-2">
          <p>{`${hostUrl}/`}</p>
          <input
            id="slug"
            type="text"
            placeholder="custom-path"
            className="w-full rounded-md bg-midnightLight px-4 py-2 text-white focus:border-none"
            {...register("slug", {
              required: {
                value: true,
                message: "Please enter a custom path or generate randomly",
              },
              pattern: {
                value: /^[a-zA-Z0-9_-]+$/i,
                message:
                  "Please enter a valid path without blank spaces or special characters",
              },
            })}
          />
          <Button
            onClick={handleGenerateRandomSlug}
            className="h-full bg-zinc-900"
            icon={<BiRefresh size={17} />}
          >
            Randomize
          </Button>
        </div>
        {errors.slug && <Alert className="mt-2">{errors.slug.message}</Alert>}
      </div>
      <div className="mb-3">
        <label htmlFor="description">Description (optional):</label>
        <textarea
          id="description"
          className="mt-1 w-full rounded-md bg-midnightLight px-4 py-2 text-white focus:border-none"
          {...register("description")}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={loading}
          loadingText="Creating your link..."
          icon={<BiRocket size={18} />}
        >
          Create your link
        </Button>
      </div>
    </form>
  );
};

export default Create;
