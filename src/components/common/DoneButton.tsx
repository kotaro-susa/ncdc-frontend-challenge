import Image from "next/image";
import { Button } from "@/components/ui/button";

interface DoneButtonProps {
  onClick?: () => void;
}

export default function DoneButton({ onClick }: DoneButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label="編集を完了"
      className="w-22.5 h-10 bg-white hover:bg-button-secondary-hover active:bg-button-secondary-active text-brand-light-blue font-ja font-bold flex-col gap-0 cursor-pointer text-[10px] py-1 border border-button-secondary-hover"
    >
      <Image src="/done.svg" alt="Done" width={24} height={24} />
      <span className="-mt-1">Done</span>
    </Button>
  );
}
