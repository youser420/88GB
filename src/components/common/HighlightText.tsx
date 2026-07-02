import { Fragment } from 'react';

import { escapeRegExp } from '@/utils';

interface HighlightTextProps {
  text: string;
  query: string;
}

/** Render `text`, wrapping case-insensitive matches of `query` in a mark. */
export function HighlightText({ text, query }: HighlightTextProps) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const pattern = new RegExp(`(${escapeRegExp(trimmed)})`, 'ig');
  const parts = text.split(pattern);
  const lowerQuery = trimmed.toLowerCase();

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === lowerQuery ? (
          <mark
            key={index}
            className="rounded bg-amber-200/70 text-inherit dark:bg-amber-400/25"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
