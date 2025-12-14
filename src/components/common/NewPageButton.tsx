import Image from "next/image";
import { Button } from "@/components/ui/button";

interface NewPageButtonProps {
  onClick?: () => void;
}

export default function NewPageButton({ onClick }: NewPageButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-22.5 h-10 bg-white hover:bg-gray-50 text-brand-light-blue font-ja font-bold flex-col gap-0 cursor-pointer text-[10px] py-1 border-2 border-brand-light-blue"
    >
      <Image src="/+.svg" alt="New page" width={24} height={24} />
      <span className="-mt-1">New page</span>
    </Button>
  );
}
