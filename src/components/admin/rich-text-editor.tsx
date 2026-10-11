"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Eye,
  Edit3,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your blog post content here...",
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = prefix + (selectedText || "text") + suffix;

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 0);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-neutral-50/80 border-b border-border">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertMarkdown("**", "**")}
            title="Bold"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("*", "*")}
            title="Italic"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <button
            type="button"
            onClick={() => insertMarkdown("# ", "")}
            title="Heading 1"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("## ", "")}
            title="Heading 2"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("### ", "")}
            title="Heading 3"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <button
            type="button"
            onClick={() => insertMarkdown("> ", "")}
            title="Quote"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("- ", "")}
            title="Bullet List"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("1. ", "")}
            title="Numbered List"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("[", "](https://)")}
            title="Add Link"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("```\n", "\n```")}
            title="Code Block"
            className="p-2 rounded-lg text-neutral-600 hover:text-[#1e1a19] hover:bg-neutral-200/60 transition-colors"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* View Toggle & Stats */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {wordCount} words · ~{readTimeMinutes} min read
          </span>
          <div className="flex items-center bg-white rounded-xl p-0.5 border border-border shadow-2xs">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                !isPreview
                  ? "bg-[#fcf1ef] text-[#eb7583] font-semibold"
                  : "text-muted-foreground hover:text-[#1e1a19]"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                isPreview
                  ? "bg-[#fcf1ef] text-[#eb7583] font-semibold"
                  : "text-muted-foreground hover:text-[#1e1a19]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      {isPreview ? (
        <div className="min-h-[400px] p-6 bg-neutral-50/40 prose prose-neutral max-w-none text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {value ? (
            value
          ) : (
            <span className="text-muted-foreground italic">
              Nothing to preview yet. Switch back to Edit mode to write content.
            </span>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={16}
          className="w-full p-5 text-base md:text-sm font-mono leading-relaxed outline-hidden resize-y bg-white text-[#1e1a19]"
          required
        />
      )}
    </div>
  );
}
