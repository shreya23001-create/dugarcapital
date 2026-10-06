import { Pipe, PipeTransform } from '@angular/core';

/** True when the text already contains HTML tags (what the rich text editor saves). */
export const looksLikeHtml = (s: string) => /<\/?[a-z][\s\S]*?>/i.test(s);

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/**
 * Turns saved text into HTML for display and for the editor.
 * Posts written with the rich text editor are already HTML and are returned as they are.
 * Older plain-text posts are converted: a blank line starts a paragraph, "## " is a heading,
 * and lines starting with "- " become bullet points.
 */
export function toHtml(text: string | null | undefined): string {
  const t = (text ?? '').trim();
  if (!t) return '';
  if (looksLikeHtml(t)) return t;

  return t
    .split(/\n\s*\n/)
    .map(chunk => chunk.trim())
    .filter(Boolean)
    .map(chunk => {
      const lines = chunk.split('\n').map(l => l.trim());
      if (chunk.startsWith('## ')) return `<h2>${escapeHtml(chunk.slice(3).trim())}</h2>`;
      if (lines.every(l => l.startsWith('- '))) return `<ul>${lines.map(l => `<li>${escapeHtml(l.slice(2).trim())}</li>`).join('')}</ul>`;
      return `<p>${lines.map(escapeHtml).join('<br>')}</p>`;
    })
    .join('');
}

/** Use as: [innerHTML]="post.excerpt | richText". Angular's own sanitiser still runs on the result. */
@Pipe({ name: 'richText' })
export class RichTextPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return toHtml(value);
  }
}
