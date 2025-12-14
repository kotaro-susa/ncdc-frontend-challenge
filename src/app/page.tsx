import Sidebar from "@/components/layout/Sidebar/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider className="mt-7.5 mx-10">
      <div className="flex w-full">
        <Sidebar />
        <SidebarInset className="flex-1">
          <main className="">コンテンツ</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
