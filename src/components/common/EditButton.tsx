import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EditButtonProps {
  onClick?: () => void;
}

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-22.5 h-10 bg-brand-light-blue hover:bg-brand-light-blue/90 text-white font-ja font-bold flex-col gap-0 cursor-pointer text-[10px] py-1"
    >
      <Image src="/edit.svg" alt="Edit" width={24} height={24} />
      <span className="-mt-1">Edit</span>
    </Button>
  );
}
