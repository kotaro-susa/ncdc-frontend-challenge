import { redirect } from "next/navigation";
import { getContentList } from "@/actions/content";

export default async function Home() {
  const contents = await getContentList();
  const firstContent = contents[0];

  if (firstContent) {
    redirect(`/${firstContent.id}`);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p>コンテンツが見つかりません</p>
    </div>
  );
}
