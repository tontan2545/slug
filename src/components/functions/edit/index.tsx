import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EditLinkInput } from "@/schema/link.schema";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Button } from "@/ui";
import toast from "react-hot-toast";
import Alert from "@/ui/alert";
import { BiCheck } from "react-icons/bi";
import { toastStyles } from "@/styles/toast";

interface EditProps {
  id: number;
  name: string;
  slug: string;
  url: string;
  description: string;
}

const Edit = ({ description, id, name, slug, url }: EditProps) => {
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<EditLinkInput>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const { mutate, error } = trpc.links.editLink.useMutation({
    onSuccess: () => {
      router.reload();
      setLoading(false);
      toast("Link edited successfully", {
        icon: "🥳",
        style: toastStyles,
      });
    },
    onError: () => {
      setLoading(false);
      alert("Error");
    },
  });

  const onSubmit = (values: EditLinkInput) => {
    setLoading(true);

    if (!values.url.includes("https://") && !values.url.includes("http://")) {
      values.url = `https://${values.url}`;
    }

    mutate({
      name: values.name,
      slug: slug,
      url: values.url,
      description: values.description,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert>
          <p>{error.message}</p>
        </Alert>
      )}
      <div className="mb-5">
        <label htmlFor="url">Link Name:</label>
        <input
          id="name"
          type="text"
          placeholder="Link name"
          defaultValue={name}
          className="mt-1 w-full rounded-md bg-midnightLight px-4 py-2 text-white focus:border-none"
          {...register("name", {
            required: {
              value: true,
              message: "Please enter a URL.",
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
          defaultValue={url}
          className="mt-1 w-full rounded-md bg-midnightLight px-4 py-2 text-white focus:border-none"
          {...register("url", {
            required: {
              value: true,
              message: "Please enter a URL.",
            },
          })}
        />
        {errors.url && <Alert className="mt-2">{errors.url.message}</Alert>}
      </div>
      <div className="mb-3">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          className="mt-1 w-full rounded-md bg-midnightLight px-4 py-2 text-white focus:border-none"
          defaultValue={description}
          {...register("description")}
        />
      </div>
      <div className="mt-5 flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          isLoading={loading}
          loadingText="Editing your link..."
          icon={<BiCheck size={18} />}
        >
          Edit link
        </Button>
      </div>
    </form>
  );
};

export default Edit;
