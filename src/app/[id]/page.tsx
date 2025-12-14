import ContentLayout from "@/components/layout/ContentLayout/ContentLayout";
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
    <ContentLayout
      contentList={contentList}
      currentId={Number(id)}
      title={content.title || ""}
      body={content.body || ""}
    />
  );
}
