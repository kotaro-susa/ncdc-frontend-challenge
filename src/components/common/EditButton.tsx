import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EditButtonProps {
  onClick?: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label="編集モードに切り替え"
      className="w-22.5 h-10 bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-active text-white font-ja font-bold flex-col gap-0 cursor-pointer text-[10px] py-1"
    >
      <Image src="/edit.svg" alt="Edit" width={24} height={24} />
      <span className="-mt-1">Edit</span>
    </Button>
  );
}
