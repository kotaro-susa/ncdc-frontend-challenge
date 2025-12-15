"use client";

import TitleEditor from "@/components/content-editor/TitleEditor";
import BodyEditor from "@/components/content-editor/BodyEditor";

interface MainContentProps {
  contentId: number;
  title: string;
  content: string;
}

/**
 * メインコンテンツ表示コンポーネント
 *
 * 責務:
 * - タイトルと本文の表示領域を提供
 * - TitleEditorとBodyEditorを配置
 */
export default function MainContent({
  contentId,
  title,
  content,
}: MainContentProps) {
  return (
    <div className="h-full flex flex-col">
      <TitleEditor contentId={contentId} title={title} />
      <BodyEditor contentId={contentId} content={content} />
    </div>
  );
}
