"use client";

import { useState, useTransition } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import EditButton from "@/components/common/EditButton";
import ActionButton from "@/components/common/ActionButton";
import { updateTitleSchema, updateBodySchema } from "@/lib/schemas";
import { updateContentTitle, updateContentBody } from "@/actions/content";
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
  const [isTopEditMode, setIsTopEditMode] = useState(false);
  const [isBottomEditMode, setIsBottomEditMode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // タイトル編集用フォーム
  const [titleForm, titleFields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: updateTitleSchema as z.ZodType
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
          setIsTopEditMode(false);
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
        schema: updateBodySchema as z.ZodType
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
          setIsBottomEditMode(false);
          router.refresh();
        } else {
          console.error(result.error);
        }
      });
    },
  });

  const handleTopEdit = () => {
    setIsTopEditMode(true);
  };

  const handleTopCancel = () => {
    titleForm.reset();
    setIsTopEditMode(false);
  };

  const handleBottomEdit = () => {
    setIsBottomEditMode(true);
  };

  const handleBottomCancel = () => {
    bodyForm.reset();
    setIsBottomEditMode(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* タイトル編集エリア */}
      <div className="flex items-center justify-between pl-7.5 py-1 shrink-0">
        {isTopEditMode ? (
          <form
            id={titleForm.id}
            onSubmit={titleForm.onSubmit}
            className="flex-1 mr-4"
          >
            <input
              type="text"
              name="title"
              defaultValue={title}
              className="w-full text-2xl font-bold text-text-black-80 bg-white border border-gray-300 rounded px-2 py-1"
              disabled={isPending}
              autoFocus
            />
            {titleFields.title.errors && (
              <p className="text-red-500 text-sm mt-1">
                {titleFields.title.errors}
              </p>
            )}
          </form>
        ) : (
          <h1 className="text-2xl font-bold text-text-black-80">{title}</h1>
        )}
        {isTopEditMode ? (
          <div className="flex gap-2.5">
            <ActionButton
              variant="cancel"
              onClick={handleTopCancel}
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
          <EditButton onClick={handleTopEdit} />
        )}
      </div>

      {/* 本文編集エリア */}
      <div className="flex-1 flex mt-4 gap-5 min-h-0">
        {isBottomEditMode ? (
          <form
            id={bodyForm.id}
            onSubmit={bodyForm.onSubmit}
            className="flex-1 flex flex-col"
          >
            <textarea
              name="body"
              defaultValue={content}
              className="flex-1 bg-white rounded-2xl py-6.5 px-7.5 text-base text-text-black-80 leading-normal resize-none overflow-y-scroll font-ja [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#B3B3B3] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500"
              disabled={isPending}
            />
            {bodyFields.body.errors && (
              <p className="text-red-500 text-sm mt-1">
                {bodyFields.body.errors}
              </p>
            )}
          </form>
        ) : (
          <div className="flex-1 bg-white rounded-2xl py-6.5 px-7.5 text-base text-text-black-80 leading-normal whitespace-pre-wrap overflow-y-scroll font-ja [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#B3B3B3] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
            {content}
          </div>
        )}

        <div className="shrink-0 flex items-start">
          {isBottomEditMode ? (
            <div className="flex gap-2.5">
              <ActionButton
                variant="cancel"
                onClick={handleBottomCancel}
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
            <EditButton onClick={handleBottomEdit} />
          )}
        </div>
      </div>
    </div>
  );
}
