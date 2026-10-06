import { afterNextRender, Component, DestroyRef, ElementRef, forwardRef, inject, input, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { toHtml } from '../rich-text';

type Item = { id: string; label: string; title: string; show?: 'full'; icon?: string; run: (e: Editor) => void; active?: (e: Editor) => boolean };

const stroke = (d: string) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

/** A formatting editor (bold, lists, headings, links…) that works with Angular forms: <app-rich-editor formControlName="…" /> */
@Component({
  selector: 'app-rich-editor',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RichEditor), multi: true }],
  template: `
    <div class="rte" [class.focused]="focused()" [class.invalid]="invalid()">
      <div class="rte-bar" role="toolbar" [attr.aria-label]="ariaLabel() + ' formatting'">
        @for (g of groups(); track $index) {
          <span class="rte-group">
            @for (it of g; track it.id) {
              <button type="button" class="rte-btn" [class.on]="isOn(it)" [attr.aria-pressed]="isOn(it)" [attr.aria-label]="it.title" [title]="it.title"
                      (mousedown)="$event.preventDefault()" (click)="press(it)" [innerHTML]="html(it)"></button>
            }
          </span>
        }
      </div>

      <div class="rte-area" [style.min-height.px]="minHeight()">
        @if (empty() && placeholder()) { <span class="rte-placeholder" aria-hidden="true">{{ placeholder() }}</span> }
        <div #host></div>
      </div>

      @if (maxChars()) {
        <div class="rte-foot" [class.over]="chars() > maxChars()">{{ chars() }} / {{ maxChars() }} characters</div>
      }
    </div>
  `,
})
export class RichEditor implements ControlValueAccessor {
  readonly variant = input<'full' | 'compact'>('full');
  readonly placeholder = input('');
  readonly minHeight = input(300);
  readonly maxChars = input(0);
  readonly ariaLabel = input('Text');
  readonly invalid = input(false);

  private readonly sanitizer = inject(DomSanitizer);
  private readonly htmlCache = new Map<string, SafeHtml>();
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private editor?: Editor;
  private pending = '';
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly focused = signal(false);
  protected readonly empty = signal(true);
  protected readonly chars = signal(0);
  private readonly tick = signal(0); // re-evaluates the toolbar state on every editor change

  private readonly items: Item[] = [
    { id: 'bold', label: '<b>B</b>', title: 'Bold', run: e => e.chain().focus().toggleBold().run(), active: e => e.isActive('bold') },
    { id: 'italic', label: '<i>I</i>', title: 'Italic', run: e => e.chain().focus().toggleItalic().run(), active: e => e.isActive('italic') },
    { id: 'underline', label: '<u>U</u>', title: 'Underline', run: e => e.chain().focus().toggleUnderline().run(), active: e => e.isActive('underline') },
    { id: 'strike', label: '<s>S</s>', title: 'Strikethrough', show: 'full', run: e => e.chain().focus().toggleStrike().run(), active: e => e.isActive('strike') },
    { id: 'h2', label: 'H2', title: 'Heading', show: 'full', run: e => e.chain().focus().toggleHeading({ level: 2 }).run(), active: e => e.isActive('heading', { level: 2 }) },
    { id: 'h3', label: 'H3', title: 'Sub-heading', show: 'full', run: e => e.chain().focus().toggleHeading({ level: 3 }).run(), active: e => e.isActive('heading', { level: 3 }) },
    { id: 'ul', label: '', icon: stroke('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.500" cy="6" r="1" fill="currentColor"/><circle cx="4.500" cy="12" r="1" fill="currentColor"/><circle cx="4.500" cy="18" r="1" fill="currentColor"/>'), title: 'Bullet points', run: e => e.chain().focus().toggleBulletList().run(), active: e => e.isActive('bulletList') },
    { id: 'ol', label: '', icon: stroke('<path d="M10 6h10M10 12h10M10 18h10M4 5h1.500v4M4 14.500c.8-.8 2-.5 2 .3 0 .9-2 1.500-2 2.700h2.200"/>'), title: 'Numbered list', run: e => e.chain().focus().toggleOrderedList().run(), active: e => e.isActive('orderedList') },
    { id: 'quote', label: '', icon: stroke('<path d="M4 6v8a3 3 0 0 0 3 3M4 11h4V6H4zM14 6v8a3 3 0 0 0 3 3M14 11h4V6h-4z"/>'), title: 'Quote', show: 'full', run: e => e.chain().focus().toggleBlockquote().run(), active: e => e.isActive('blockquote') },
    { id: 'link', label: '', icon: stroke('<path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>'), title: 'Add or edit link', run: e => this.link(e), active: e => e.isActive('link') },
    { id: 'hr', label: '', icon: stroke('<path d="M4 12h16"/>'), title: 'Divider line', show: 'full', run: e => e.chain().focus().setHorizontalRule().run() },
    { id: 'undo', label: '', icon: stroke('<path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>'), title: 'Undo', run: e => e.chain().focus().undo().run() },
    { id: 'redo', label: '', icon: stroke('<path d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3"/>'), title: 'Redo', run: e => e.chain().focus().redo().run() },
    { id: 'clear', label: '', icon: stroke('<path d="M6 5h12M10 5l-2 14M14 5l-1.500 8M4 20l16-16"/>'), title: 'Clear formatting', run: e => e.chain().focus().clearNodes().unsetAllMarks().run() },
  ];

  /** buttons grouped with a thin divider between groups; the compact variant hides the heavier tools */
  protected groups() {
    const list = this.items.filter(i => this.variant() === 'full' || !i.show);
    const sets = [['bold', 'italic', 'underline', 'strike'], ['h2', 'h3'], ['ul', 'ol', 'quote'], ['link', 'hr'], ['undo', 'redo', 'clear']];
    return sets.map(ids => list.filter(i => ids.includes(i.id))).filter(g => g.length);
  }

  constructor() {
    afterNextRender(() => this.create());
    inject(DestroyRef).onDestroy(() => this.editor?.destroy());
  }

  private create() {
    this.editor = new Editor({
      element: this.host().nativeElement,
      content: this.pending,
      extensions: [
        StarterKit.configure({
          heading: { levels: [2, 3] },
          code: false,
          codeBlock: false,
          link: { openOnClick: false, autolink: true, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer nofollow' } },
        }),
      ],
      editorProps: { attributes: { class: 'rte-content', 'aria-label': this.ariaLabel(), role: 'textbox', 'aria-multiline': 'true' } },
      onUpdate: ({ editor }) => {
        this.sync(editor);
        this.onChange(editor.isEmpty ? '' : editor.getHTML());
      },
      onFocus: () => this.focused.set(true),
      onBlur: () => {
        this.focused.set(false);
        this.onTouched();
      },
      onTransaction: () => this.tick.update(n => n + 1),
    });
    this.sync(this.editor);
  }

  private sync(e: Editor) {
    this.empty.set(e.isEmpty);
    this.chars.set(e.getText().length);
  }

  /** button face: only the constant strings defined above are ever passed here, never user input */
  protected html(it: Item): SafeHtml {
    let v = this.htmlCache.get(it.id);
    if (!v) {
      v = this.sanitizer.bypassSecurityTrustHtml(it.icon ?? it.label);
      this.htmlCache.set(it.id, v);
    }
    return v;
  }

  protected isOn(it: Item) {
    this.tick();
    return !!this.editor && !!it.active?.(this.editor);
  }

  protected press(it: Item) {
    if (this.editor) it.run(this.editor);
  }

  private link(e: Editor) {
    const current = e.getAttributes('link')['href'] as string | undefined;
    const url = window.prompt('Link address (for example https://example.com). Leave empty to remove the link.', current ?? 'https://');
    if (url === null) return; // cancelled
    const clean = url.trim();
    if (!clean || clean === 'https://') {
      e.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    const href = /^(https?:\/\/|mailto:|tel:)/i.test(clean) ? clean : 'https://' + clean;
    e.chain().focus().extendMarkRange('link').setLink({ href }).run();
  }

  /* ---- ControlValueAccessor ---- */
  writeValue(value: string | null): void {
    this.pending = toHtml(value);
    if (this.editor) {
      this.editor.commands.setContent(this.pending, { emitUpdate: false });
      this.sync(this.editor);
    }
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.editor?.setEditable(!disabled);
  }
}
