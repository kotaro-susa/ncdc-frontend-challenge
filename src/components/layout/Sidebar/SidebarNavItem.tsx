interface SidebarNavItemProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function SidebarNavItem({
  label,
  isActive = false,
  onClick,
}: SidebarNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-50 h-11
        flex items-center
        font-ja text-base
        transition-colors
        ${
          isActive
            ? "bg-[#F5F8FA] text-[#32A8F8] font-bold rounded"
            : "bg-white text-text-black-80 font-normal hover:bg-gray-50"
        }
      `}
    >
      {/* Label text */}
      <span className="pl-4">{label}</span>
    </button>
  );
}
