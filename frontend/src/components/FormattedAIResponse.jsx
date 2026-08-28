import React, { useState } from "react";

/**
 * Custom Rich Markdown Formatter for Focus AI Responses
 * Parses bold text, lists, headers, code blocks, tips, and key-values cleanly.
 */
const FormattedAIResponse = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!content) return null;

  // Split into code blocks vs text blocks
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2.5 text-xs text-zinc-200 leading-relaxed">
      {blocks.map((block, blockIdx) => {
        // Check if this block is a code block
        if (block.startsWith("```")) {
          const firstLineEnd = block.indexOf("\n");
          const language = firstLineEnd !== -1 ? block.slice(3, firstLineEnd).trim() : "";
          const codeContent = firstLineEnd !== -1 ? block.slice(firstLineEnd + 1, -3).trim() : block.slice(3, -3).trim();

          return (
            <div key={blockIdx} className="my-3 rounded-xl border border-zinc-700/60 bg-zinc-950 overflow-hidden shadow-lg">
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400">
                <span className="font-mono uppercase font-semibold text-violet-400">{language || "Code"}</span>
                <button
                  onClick={() => handleCopyCode(codeContent, blockIdx)}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  {copiedIndex === blockIdx ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        // Regular text block processing
        const lines = block.split("\n");

        return (
          <div key={blockIdx} className="space-y-2">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              // Headers (# , ## , ### )
              if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
                const headerText = trimmed.replace(/^#+\s*/, "");
                return (
                  <h4 key={lineIdx} className="text-sm font-bold text-white pt-2 pb-1 border-b border-zinc-800/80 flex items-center gap-2">
                    <span className="text-violet-400">⚡</span>
                    {renderInlineFormatted(headerText)}
                  </h4>
                );
              }

              // Bullet points (- or * or •)
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
                const bulletText = trimmed.replace(/^[-*•]\s*/, "");
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-1 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                    <div className="flex-1 text-zinc-300">{renderInlineFormatted(bulletText)}</div>
                  </div>
                );
              }

              // Numbered List (1. 2. etc)
              if (/^\d+\.\s/.test(trimmed)) {
                const num = trimmed.match(/^(\d+)\.\s/)[1];
                const itemText = trimmed.replace(/^\d+\.\s/, "");
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 pl-1 py-1">
                    <span className="w-4 h-4 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {num}
                    </span>
                    <div className="flex-1 text-zinc-200">{renderInlineFormatted(itemText)}</div>
                  </div>
                );
              }

              // Quotes / Tips (> )
              if (trimmed.startsWith("> ")) {
                const quoteText = trimmed.replace(/^>\s*/, "");
                return (
                  <div key={lineIdx} className="p-3 my-2 rounded-xl bg-violet-950/30 border border-violet-500/30 text-violet-200 text-xs italic flex items-center gap-2">
                    <span>💡</span>
                    <div>{renderInlineFormatted(quoteText)}</div>
                  </div>
                );
              }

              // Normal paragraph line
              return (
                <p key={lineIdx} className="leading-relaxed">
                  {renderInlineFormatted(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Helper to render inline formatting:
 * **bold**, `inline code`, and highlights.
 */
const renderInlineFormatted = (text) => {
  if (!text) return null;

  // Split by bold (**...**) and inline code (`...`)
  const parts = text.split(/(\*\*[\s\S]*?\*\*|`[\s\S]*?`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-white bg-violet-500/10 px-1 py-0.5 rounded border border-violet-500/20">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="font-mono text-[11px] text-amber-300 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export default FormattedAIResponse;
