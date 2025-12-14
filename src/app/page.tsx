import Sidebar from "@/components/layout/Sidebar/Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <div className="flex w-full h-full ">
        <Sidebar />
        <SidebarInset className="flex-1 pt-7.5">
          <main className="">コンテンツ</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
