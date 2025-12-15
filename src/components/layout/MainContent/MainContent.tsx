"use client";

import { useState, useTransition } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import EditButton from "@/components/common/EditButton";
import ActionButton from "@/components/common/ActionButton";
import { updateTitleSchema, updateBodySchema } from "@/lib/schemas";
import { updateContentTitle, updateContentBody } from "@/actions/form-action";
import { useRouter } from "next/navigation";
import type { z } from "zod";

interface MainContentProps {
  contentId: number;
  title: string;
  content: string;
}

export default function MainContent({
  contentId,
  title,
  content,
}: MainContentProps) {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isBodyEditing, setIsBodyEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // タイトル編集用フォーム
  const [titleForm, titleFields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: updateTitleSchema as z.ZodType,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      title,
    },
    async onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(async () => {
        const result = await updateContentTitle(contentId, formData);

        if (result.success) {
          setIsTitleEditing(false);
          router.refresh();
        } else {
          console.error(result.error);
        }
      });
    },
  });

  // 本文編集用フォーム
  const [bodyForm, bodyFields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: updateBodySchema as z.ZodType,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      body: content,
    },
    async onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(async () => {
        const result = await updateContentBody(contentId, formData);

        if (result.success) {
          setIsBodyEditing(false);
          router.refresh();
        } else {
          console.error(result.error);
        }
      });
    },
  });

  const handleTitleEdit = () => {
    setIsTitleEditing(true);
  };

  const handleTitleCancel = () => {
    titleForm.reset();
    setIsTitleEditing(false);
  };

  const handleBodyEdit = () => {
    setIsBodyEditing(true);
  };

  const handleBodyCancel = () => {
    bodyForm.reset();
    setIsBodyEditing(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* タイトル編集エリア */}
      <div className="flex items-center justify-between shrink-0">
        {isTitleEditing ? (
          <form
            id={titleForm.id}
            onSubmit={titleForm.onSubmit}
            className="flex-1 mr-4"
          >
            <input
              type="text"
              name="title"
              defaultValue={title}
              className="w-full text-2xl pl-7.5  font-bold text-text-black-80 bg-white border border-[#4cb3f8] rounded py-1 focus:outline-none focus:border-[#4cb3f8]"
              disabled={isPending}
              autoFocus
              required
              maxLength={50}
            />
            {titleFields.title.errors && (
              <p className="text-red-500 text-sm mt-1">
                {titleFields.title.errors}
              </p>
            )}
          </form>
        ) : (
          <h1 className="text-2xl pl-7.5  font-bold text-text-black-80">
            {title}
          </h1>
        )}
        {isTitleEditing ? (
          <div className="flex gap-2.5">
            <ActionButton
              variant="cancel"
              onClick={handleTitleCancel}
              disabled={isPending}
            />
            <ActionButton
              variant="save"
              type="submit"
              form={titleForm.id}
              disabled={isPending}
            />
          </div>
        ) : (
          <EditButton onClick={handleTitleEdit} />
        )}
      </div>

      {/* 本文編集エリア */}
      <div className="flex-1 flex mt-4 gap-5 min-h-0">
        {isBodyEditing ? (
          <form
            id={bodyForm.id}
            onSubmit={bodyForm.onSubmit}
            className="flex-1 flex flex-col"
          >
            <textarea
              name="body"
              defaultValue={content}
              className="flex-1 bg-white rounded-2xl py-7.5 pl-7.5 pr-5 text-base text-text-black-80 leading-normal resize-none overflow-y-auto font-ja border border-[#4cb3f8] focus:outline-none focus:border-[#4cb3f8] box-border [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:mr-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-6.5 [&::-webkit-scrollbar-thumb]:bg-[#B3B3B3] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500"
              disabled={isPending}
              required
              minLength={10}
              maxLength={2000}
            />
            {bodyFields.body.errors && (
              <p className="text-red-500 text-sm mt-1">
                {bodyFields.body.errors}
              </p>
            )}
          </form>
        ) : (
          <div className="flex-1 bg-white rounded-2xl py-7.5 px-7.5 text-base text-text-black-80 leading-normal whitespace-pre-wrap overflow-y-scroll font-ja [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:my-6.5 [&::-webkit-scrollbar-thumb]:bg-[#B3B3B3] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
            {content}
          </div>
        )}

        <div className="shrink-0 flex items-start">
          {isBodyEditing ? (
            <div className="flex gap-2.5">
              <ActionButton
                variant="cancel"
                onClick={handleBodyCancel}
                disabled={isPending}
              />
              <ActionButton
                variant="save"
                type="submit"
                form={bodyForm.id}
                disabled={isPending}
              />
            </div>
          ) : (
            <EditButton onClick={handleBodyEdit} />
          )}
        </div>
      </div>
    </div>
  );
}
