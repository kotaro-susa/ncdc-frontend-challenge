"use client";

import EditButton from "@/components/common/EditButton";
import ActionButton from "@/components/common/ActionButton";
import { useTitleEditor } from "@/hooks/use-title-editor";

interface TitleEditorProps {
  contentId: number;
  title: string;
}

/**
 * タイトル編集コンポーネント
 *
 * 責務:
 * - タイトルの表示/編集UIの切り替え
 * - フォームの表示とバリデーションエラーの表示
 */
export default function TitleEditor({ contentId, title }: TitleEditorProps) {
  const { isEditing, isPending, form, fields, handlers } = useTitleEditor(
    contentId,
    title
  );

  return (
    <div className="flex items-center justify-between shrink-0">
      {isEditing ? (
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          className="flex-1 mr-4"
        >
          <input
            type="text"
            name="title"
            defaultValue={title}
            className="w-full text-2xl pl-7.5 font-bold text-text-black-80 bg-white border border-brand-light-blue rounded py-1 focus:outline-none focus:border-brand-light-blue"
            disabled={isPending}
            autoFocus
            required
            maxLength={50}
          />
          {fields.title.errors && (
            <p className="text-red-500 text-sm mt-1">
              {fields.title.errors}
            </p>
          )}
        </form>
      ) : (
        <h1 className="text-2xl pl-7.5 font-bold text-text-black-80">
          {title}
        </h1>
      )}
      {isEditing ? (
        <div className="flex gap-2.5">
          <ActionButton
            variant="cancel"
            onClick={handlers.onCancel}
            disabled={isPending}
          />
          <ActionButton
            variant="save"
            type="submit"
            form={form.id}
            disabled={isPending}
          />
        </div>
      ) : (
        <EditButton onClick={handlers.onEdit} />
      )}
    </div>
  );
}
