"use client";

import { useState } from "react";
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
 * - 排他的な編集状態の管理（タイトルと本文のどちらか一方のみ編集可能）
 */
export default function MainContent({
  contentId,
  title,
  content,
}: MainContentProps) {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isBodyEditing, setIsBodyEditing] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <TitleEditor
        contentId={contentId}
        title={title}
        isEditing={isTitleEditing}
        onEditingChange={setIsTitleEditing}
        disabled={isBodyEditing}
      />
      <BodyEditor
        contentId={contentId}
        content={content}
        isEditing={isBodyEditing}
        onEditingChange={setIsBodyEditing}
        disabled={isTitleEditing}
      />
    </div>
  );
}
