"use client";

import { useState } from "react";
import EditButton from "@/components/common/EditButton";
import ActionButton from "@/components/common/ActionButton";

interface MainContentProps {
  title: string;
  content: string;
}

export default function MainContent({ title, content }: MainContentProps) {
  const [isTopEditMode, setIsTopEditMode] = useState(false);
  const [isBottomEditMode, setIsBottomEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleTopEdit = () => {
    setIsTopEditMode(true);
  };

  const handleTopCancel = () => {
    setEditTitle(title);
    setIsTopEditMode(false);
  };

  const handleTopSave = () => {
    // TODO: 保存処理を実装
    setIsTopEditMode(false);
  };

  const handleBottomEdit = () => {
    setIsBottomEditMode(true);
  };

  const handleBottomCancel = () => {
    setIsBottomEditMode(false);
  };

  const handleBottomSave = () => {
    // TODO: 保存処理を実装
    setIsBottomEditMode(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pl-7.5 py-1 shrink-0">
        {isTopEditMode ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-2xl font-bold text-text-black-80 bg-white border border-gray-300 rounded px-2 py-1 flex-1 mr-4"
          />
        ) : (
          <h1 className="text-2xl font-bold text-text-black-80">{title}</h1>
        )}
        {isTopEditMode ? (
          <div className="flex gap-2.5">
            <ActionButton variant="cancel" onClick={handleTopCancel} />
            <ActionButton variant="save" onClick={handleTopSave} />
          </div>
        ) : (
          <EditButton onClick={handleTopEdit} />
        )}
      </div>
      <div className="flex-1 flex mt-4 gap-5 min-h-0">
        <div className="flex-1 bg-white rounded-2xl py-6.5 px-7.5 text-base text-text-black-80 leading-normal whitespace-pre-wrap overflow-y-scroll font-ja [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#B3B3B3] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
          {content}
        </div>
        <div className="shrink-0 flex items-start">
          {isBottomEditMode ? (
            <div className="flex gap-2.5">
              <ActionButton variant="cancel" onClick={handleBottomCancel} />
              <ActionButton variant="save" onClick={handleBottomSave} />
            </div>
          ) : (
            <EditButton onClick={handleBottomEdit} />
          )}
        </div>
      </div>
    </div>
  );
}
