import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DoneButtonProps {
  onClick?: () => void;
}

export default function DoneButton({ onClick }: DoneButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-22.5 h-10 bg-brand-light-blue hover:bg-brand-light-blue/90 text-white font-ja font-bold flex-col gap-0 cursor-pointer text-[10px] py-1"
    >
      <Image src="/done.svg" alt="Done" width={24} height={24} />
      <span className="-mt-1">Done</span>
    </Button>
  );
}
