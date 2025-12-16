"use client";

import EditButton from "@/components/common/EditButton";
import ActionButton from "@/components/common/ActionButton";
import { useBodyEditor } from "@/hooks/use-body-editor";

interface BodyEditorProps {
  contentId: number;
  content: string;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  disabled?: boolean;
}

/**
 * 本文編集コンポーネント
 *
 * 責務:
 * - 本文の表示/編集UIの切り替え
 * - フォームの表示とバリデーションエラーの表示
 */
export default function BodyEditor({
  contentId,
  content,
  isEditing: externalIsEditing,
  onEditingChange,
  disabled = false,
}: BodyEditorProps) {
  const { isPending, form, fields, optimisticValue } = useBodyEditor(
    contentId,
    content,
    onEditingChange
  );

  const isEditing = externalIsEditing ?? false;

  const handleEdit = () => {
    onEditingChange?.(true);
  };

  const handleCancel = () => {
    form.reset();
    onEditingChange?.(false);
  };

  const displayContent = optimisticValue.body ?? content;

  return (
    <div className="flex-1 flex mt-4 gap-5 min-h-0">
      {isEditing ? (
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          className="flex-1 flex flex-col"
        >
          <textarea
            name="body"
            defaultValue={displayContent}
            className="flex-1 bg-white rounded-2xl py-7.5 pl-7.5 pr-5 text-base text-text-black-80 leading-normal resize-none overflow-y-auto font-ja border border-brand-light-blue focus:outline-none focus:border-brand-light-blue box-border [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:mr-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-6.5 [&::-webkit-scrollbar-thumb]:bg-button-normal [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500"
            disabled={isPending}
            required
            minLength={10}
            maxLength={2000}
          />
          {fields.body.errors && (
            <p className="text-red-500 text-sm mt-1">{fields.body.errors}</p>
          )}
        </form>
      ) : (
        <div className="flex-1 bg-white rounded-2xl py-7.5 px-7.5 text-base text-text-black-80 leading-normal whitespace-pre-wrap overflow-y-scroll font-ja [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:my-6.5 [&::-webkit-scrollbar-thumb]:bg-button-normal [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
          {displayContent}
        </div>
      )}

      <div className="shrink-0 flex items-start">
        {isEditing ? (
          <div className="flex gap-2.5">
            <ActionButton
              variant="cancel"
              onClick={handleCancel}
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
          <EditButton onClick={handleEdit} disabled={disabled} />
        )}
      </div>
    </div>
  );
}
