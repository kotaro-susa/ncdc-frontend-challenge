import Sidebar from "@/components/layout/Sidebar/Sidebar";
import Footer from "@/components/layout/Footer/Footer";
import MainContent from "@/components/layout/MainContent/MainContent";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getContent, getContentList } from "@/actions/content";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [content, contentList] = await Promise.all([
    getContent(Number(id)),
    getContentList(),
  ]);

  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <div className="flex w-full h-full">
        <Sidebar contentList={contentList} currentId={Number(id)} />
        <SidebarInset className="flex-1 flex flex-col">
          <main className="flex-1 p-7.5 bg-[#F5F8FA] overflow-hidden mt-7.5 mx-10 rounded-2xl">
            <MainContent
              title={content.title || ""}
              content={content.body || ""}
            />
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
