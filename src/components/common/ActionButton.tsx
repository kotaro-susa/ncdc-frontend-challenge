import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  variant: "cancel" | "save";
  onClick?: () => void;
}

export default function ActionButton({ variant, onClick }: ActionButtonProps) {
  const isCancel = variant === "cancel";

  return (
    <Button
      onClick={onClick}
      className={`w-10 h-10 ${
        isCancel
          ? "bg-[#999999] hover:bg-[#999999]/90"
          : "bg-brand-light-blue hover:bg-brand-light-blue/90"
      } text-white font-ja font-bold flex-col gap-0 cursor-pointer text-[10px] p-0`}
    >
      <Image
        src={isCancel ? "/cancel.svg" : "/save.svg"}
        alt={isCancel ? "Cancel" : "Save"}
        width={24}
        height={24}
      />
      <span className="-mt-1">{isCancel ? "Cancel" : "Save"}</span>
    </Button>
  );
}
