import Image from "next/image";
import { Button } from "@/components/ui/button";

interface NewPageButtonProps {
  onClick?: () => void;
}

export default function NewPageButton({ onClick }: NewPageButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label="新しいページを作成"
      className="w-22.5 h-10 bg-white hover:bg-button-secondary-hover active:bg-button-secondary-active text-brand-light-blue font-ja font-bold flex-col gap-0 cursor-pointer text-[10px] py-1 border border-button-secondary-hover"
    >
      <Image src="/+.svg" alt="New page" width={24} height={24} />
      <span className="-mt-1">New page</span>
    </Button>
  );
}
