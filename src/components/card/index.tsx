import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiCopy, BiEdit, BiSlider, BiTrash } from "react-icons/bi";
import IconButton from "@/ui/iconButton";
import { Dropdown, DropdownItem } from "@/ui/dropdown";
import Modal from "@/ui/modal";
import getRootDomain from "get-root-domain";
import Edit from "../functions/edit";
import Delete from "../functions/delete";

import { toastStyles } from "@/styles/toast";
import { Link } from "@prisma/client";
import { useHostUrl } from "@/hooks/useHostURL";

import Image from "next/image";

type Props = {
  link: Link;
  className?: React.ComponentProps<"div">["className"];
};

const Card = ({ link, ...props }: Props) => {
  const { id, name, slug, url, description } = link;
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const { redirectUrl } = useHostUrl(slug);
  const handleEditModal = () => {
    setEditModal(!editModal);
  };

  const handleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const copyToClipboard = async (txt: string) => {
    try {
      const clipboardItem = new ClipboardItem({
        "text/plain": new Blob([txt], { type: "text/plain" }),
      });
      await navigator.clipboard.write([clipboardItem]);
    } catch (error) {
      await navigator.clipboard.writeText(txt);
    }
    toast("Copied to clipboard", {
      icon: "🚀",
      style: toastStyles,
    });
  };

  const onImageError = (e: any) => {
    setIsImageError(true);
  };

  const urlObj = new URL(url);
  const faviconUrl = `${urlObj.protocol}//${getRootDomain(urlObj)}/favicon.ico`;

  return (
    <div
      className={`flex justify-between rounded-lg border border-zinc-800 bg-midnight  p-4 transition-all hover:shadow-lg ${props.className}`}
    >
      <div className="space-y-1 truncate">
        <div className="flex items-center space-x-2">
          <a target="_blank" rel="noreferrer" href={redirectUrl}>
            {!isImageError && (
              <img
                src={faviconUrl}
                alt={`${url}-logo`}
                className="h-5 w-5"
                onError={onImageError}
              />
            )}
          </a>
          <a
            className="text-xl text-gray-100 transition-all hover:text-gray-300"
            target="_blank"
            rel="noreferrer"
            href={redirectUrl}
          >
            {name}
          </a>
          <IconButton
            icon={<BiCopy />}
            className="p-1 text-gray-500 transition-colors duration-200 hover:text-gray-200"
            onClick={() => copyToClipboard(redirectUrl)}
          />
        </div>
        <div className="flex space-y-2">
          <p className="text-gray-500">{redirectUrl}</p>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
      <div>
        <Dropdown
          title="Options"
          className="bg-transparent text-gray-300 hover:text-white"
          icon={<BiSlider size={17} />}
        >
          <DropdownItem
            icon={<BiCopy size={17} />}
            onClick={() => copyToClipboard(redirectUrl)}
          >
            Copy
          </DropdownItem>
          <DropdownItem icon={<BiEdit size={17} />} onClick={handleEditModal}>
            Edit
          </DropdownItem>
          <DropdownItem
            icon={<BiTrash size={17} />}
            onClick={handleDeleteModal}
          >
            Delete
          </DropdownItem>
        </Dropdown>
        <Modal
          title={`Edit: /${slug}`}
          open={editModal}
          close={handleEditModal}
        >
          <Edit
            id={id}
            name={name}
            slug={slug}
            url={url}
            description={description || ""}
          />
        </Modal>
        <Modal
          title={`Delete: /s/${slug}`}
          open={deleteModal}
          close={handleDeleteModal}
        >
          <Delete id={id} />
        </Modal>
      </div>
    </div>
  );
};

export default Card;
