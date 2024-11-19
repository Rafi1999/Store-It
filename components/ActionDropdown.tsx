"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { renameFile } from "@/lib/actions/file.action";
import { usePathname } from "next/navigation";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
    const path = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [name, setName] = useState(file.name);
  const [action, setAcion] = useState<ActionType | null>(null);

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAcion(null);
    setName(file.name);
    setIsLoading(false);
  };
  const handleActions = async () => {
    if (!action) {
      return;
    }
    setIsLoading(true);
    let successs = false;
    const actions = {
        rename : ()=>renameFile({fileId : file.$id, name : name, extension : file.extension, path}),
        share : ()=>console.log('share'),
        delete : ()=>console.log('delete'),
    }
    successs = await actions[action.value as keyof typeof actions]();
    if(successs){
        closeAllModals();
        setIsLoading(false);
    }
  };
  const renderDialogContent = () => {
    if (!action) {
      return null;
    }
    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-light-100 text-center">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Input>
          )}
        </DialogHeader>
        {["rename", "share", "delete", "details"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleActions} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  width={24}
                  height={24}
                  className="animate-spin"
                  alt="loader"
                ></Image>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              className="shad-dropdown-item"
              onClick={() => {
                setAcion(item);
                if (
                  ["rename", "share", "delete", "details"].includes(item.value)
                ) {
                  setIsModalOpen(true);
                }
              }}
              key={item.value}
            >
              {item.value === "download" ? (
                <Link
                  download={file.name}
                  className="flex items-center gap-2"
                  href={constructDownloadUrl(file.bucketFileId)}
                >
                  <Image
                    src={item.icon}
                    alt="item.label"
                    width={30}
                    height={30}
                  />
                  {item.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={item.icon}
                    alt="item.label"
                    width={30}
                    height={30}
                  />
                  {item.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
