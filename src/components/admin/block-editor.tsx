"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronUp,
  Code2,
  Heading2,
  Image as ImageIcon,
  Info,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Table as TableIcon,
  Trash2,
  Type,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { inputClasses, textareaClasses } from "./ui"
import type { ContentBlock } from "@/lib/content/insights-types"

/**
 * Structured content editor.
 *
 * Edits the same typed block array the public article renderer consumes, so
 * what an author builds here is exactly what ships — no HTML string to
 * sanitise and no conversion step that can lose fidelity.
 *
 * Inline formatting inside text fields uses a small markdown subset that the
 * renderer understands: **bold**, *italic*, `code` and [text](/href).
 */

type BlockKind = ContentBlock["type"]

const BLOCK_TYPES: Array<{ kind: BlockKind; label: string; icon: typeof Type }> = [
  { kind: "paragraph", label: "Paragraph", icon: Pilcrow },
  { kind: "heading", label: "Heading", icon: Heading2 },
  { kind: "list", label: "List", icon: List },
  { kind: "quote", label: "Quote", icon: Quote },
  { kind: "code", label: "Code", icon: Code2 },
  { kind: "image", label: "Image", icon: ImageIcon },
  { kind: "table", label: "Table", icon: TableIcon },
  { kind: "callout", label: "Callout", icon: Info },
  { kind: "embed", label: "Embed", icon: Link2 },
  { kind: "divider", label: "Divider", icon: Minus },
]

function blankBlock(kind: BlockKind): ContentBlock {
  switch (kind) {
    case "heading":
      return { type: "heading", level: 2, text: "" }
    case "list":
      return { type: "list", ordered: false, items: [""] }
    case "quote":
      return { type: "quote", text: "" }
    case "code":
      return { type: "code", language: "ts", code: "" }
    case "image":
      return { type: "image", src: "", alt: "" }
    case "table":
      return { type: "table", head: ["Column", "Column"], rows: [["", ""]] }
    case "callout":
      return { type: "callout", title: "", text: "" }
    case "embed":
      return { type: "embed", title: "", url: "" }
    case "divider":
      return { type: "divider" }
    default:
      return { type: "paragraph", text: "" }
  }
}

function labelFor(kind: BlockKind): string {
  return BLOCK_TYPES.find((type) => type.kind === kind)?.label ?? kind
}

export function BlockEditor({
  value,
  onChange,
  onPickImage,
}: {
  value: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  /** Opens the media library and resolves with a URL. */
  onPickImage?: () => Promise<{ url: string; alt: string } | null>
}) {
  function update(index: number, block: ContentBlock) {
    const next = [...value]
    next[index] = block
    onChange(next)
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function move(index: number, delta: number) {
    const target = index + delta
    if (target < 0 || target >= value.length) return
    const next = [...value]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    onChange(next)
  }

  function add(kind: BlockKind) {
    onChange([...value, blankBlock(kind)])
  }

  return (
    <div className="space-y-4">
      {value.length === 0 ? (
        <p className="rounded-lg bg-surface-raised px-4 py-8 text-center text-sm text-muted-foreground ring-1 ring-hairline">
          No content yet. Add a block below to start writing.
        </p>
      ) : null}

      {value.map((block, index) => (
        <div
          key={index}
          className="rounded-xl bg-surface-raised ring-1 ring-hairline"
        >
          <div className="flex items-center justify-between gap-2 border-b border-hairline px-4 py-2.5">
            <span className="font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.12em] text-muted-foreground/70 uppercase">
              {index + 1} · {labelFor(block.type)}
            </span>
            <div className="flex items-center gap-0.5">
              <IconButton
                label="Move up"
                onClick={() => move(index, -1)}
                disabled={index === 0}
              >
                <ChevronUp className="size-3.5" />
              </IconButton>
              <IconButton
                label="Move down"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
              >
                <ChevronDown className="size-3.5" />
              </IconButton>
              <IconButton label="Remove block" destructive onClick={() => remove(index)}>
                <Trash2 className="size-3.5" />
              </IconButton>
            </div>
          </div>

          <div className="p-4">
            <BlockFields
              block={block}
              index={index}
              onChange={(next) => update(index, next)}
              onPickImage={onPickImage}
            />
          </div>
        </div>
      ))}

      {/* Add block */}
      <div className="rounded-xl border border-dashed border-hairline p-4">
        <p className="mb-3 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.12em] text-muted-foreground/70 uppercase">
          Add block
        </p>
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map((type) => (
            <button
              key={type.kind}
              type="button"
              onClick={() => add(type.kind)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-primary/30"
            >
              <type.icon className="size-3.5 text-brand-lift" aria-hidden />
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
  destructive,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors disabled:pointer-events-none disabled:opacity-35",
        destructive ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

function BlockFields({
  block,
  index,
  onChange,
  onPickImage,
}: {
  block: ContentBlock
  index: number
  onChange: (block: ContentBlock) => void
  onPickImage?: () => Promise<{ url: string; alt: string } | null>
}) {
  const id = (suffix: string) => `block-${index}-${suffix}`

  switch (block.type) {
    case "paragraph":
      return (
        <>
          <textarea
            id={id("text")}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            rows={4}
            placeholder="Write the paragraph. **bold**, *italic*, `code` and [links](/page) are supported."
            className={textareaClasses}
          />
          <InlineHint />
        </>
      )

    case "heading":
      return (
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            aria-label="Heading level"
            value={block.level}
            onChange={(e) =>
              onChange({ ...block, level: Number(e.target.value) as 2 | 3 })
            }
            className={cn(inputClasses, "sm:w-32")}
          >
            <option value={2}>Heading 2</option>
            <option value={3}>Heading 3</option>
          </select>
          <input
            id={id("text")}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Heading text"
            className={cn(inputClasses, "flex-1")}
          />
        </div>
      )

    case "list":
      return (
        <div className="space-y-3">
          <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={Boolean(block.ordered)}
              onChange={(e) => onChange({ ...block, ordered: e.target.checked })}
              className="size-4 rounded border-input bg-input/30 accent-[oklch(0.6676_0.1797_248.36)]"
            />
            <ListOrdered className="size-3.5" aria-hidden />
            Numbered list
          </label>

          {block.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const items = [...block.items]
                  items[itemIndex] = e.target.value
                  onChange({ ...block, items })
                }}
                placeholder={`Item ${itemIndex + 1}`}
                className={cn(inputClasses, "flex-1")}
                aria-label={`List item ${itemIndex + 1}`}
              />
              <IconButton
                label={`Remove item ${itemIndex + 1}`}
                destructive
                onClick={() =>
                  onChange({
                    ...block,
                    items: block.items.filter((_, i) => i !== itemIndex),
                  })
                }
              >
                <Trash2 className="size-3.5" />
              </IconButton>
            </div>
          ))}

          <Button
            size="xs"
            variant="outline"
            onClick={() => onChange({ ...block, items: [...block.items, ""] })}
          >
            Add item
          </Button>
          <InlineHint />
        </div>
      )

    case "quote":
      return (
        <div className="space-y-3">
          <textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            rows={3}
            placeholder="Quotation"
            className={textareaClasses}
            aria-label="Quote text"
          />
          <input
            value={block.attribution ?? ""}
            onChange={(e) => onChange({ ...block, attribution: e.target.value })}
            placeholder="Attribution (optional)"
            className={inputClasses}
            aria-label="Quote attribution"
          />
        </div>
      )

    case "code":
      return (
        <div className="space-y-3">
          <input
            value={block.language ?? ""}
            onChange={(e) => onChange({ ...block, language: e.target.value })}
            placeholder="Language, e.g. ts, sql, bash"
            className={cn(inputClasses, "sm:w-56")}
            aria-label="Code language"
          />
          <textarea
            value={block.code}
            onChange={(e) => onChange({ ...block, code: e.target.value })}
            rows={8}
            spellCheck={false}
            placeholder="Paste code here"
            className={cn(textareaClasses, "font-[family-name:var(--font-mono)] text-[0.8125rem]")}
            aria-label="Code"
          />
          <input
            value={block.caption ?? ""}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)"
            className={inputClasses}
            aria-label="Code caption"
          />
        </div>
      )

    case "image":
      return (
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              placeholder="/insights/example.png"
              className={cn(inputClasses, "flex-1")}
              aria-label="Image path"
            />
            {onPickImage ? (
              <Button
                size="cta"
                variant="outline"
                onClick={async () => {
                  const picked = await onPickImage()
                  if (picked) onChange({ ...block, src: picked.url, alt: picked.alt })
                }}
              >
                <ImageIcon aria-hidden />
                Choose
              </Button>
            ) : null}
          </div>
          <input
            value={block.alt}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
            placeholder="Alt text — describe the image (required)"
            className={inputClasses}
            aria-label="Image alt text"
          />
          <input
            value={block.caption ?? ""}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)"
            className={inputClasses}
            aria-label="Image caption"
          />
        </div>
      )

    case "table":
      return (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Header cells, then one line per row with cells separated by a pipe
            character.
          </p>
          <input
            value={block.head.join(" | ")}
            onChange={(e) =>
              onChange({ ...block, head: e.target.value.split("|").map((c) => c.trim()) })
            }
            placeholder="Column A | Column B"
            className={inputClasses}
            aria-label="Table header row"
          />
          <textarea
            value={block.rows.map((row) => row.join(" | ")).join("\n")}
            onChange={(e) =>
              onChange({
                ...block,
                rows: e.target.value
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line) => line.split("|").map((c) => c.trim())),
              })
            }
            rows={5}
            placeholder={"Value | Value\nValue | Value"}
            className={cn(textareaClasses, "font-[family-name:var(--font-mono)] text-[0.8125rem]")}
            aria-label="Table rows"
          />
          <input
            value={block.caption ?? ""}
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)"
            className={inputClasses}
            aria-label="Table caption"
          />
        </div>
      )

    case "callout":
      return (
        <div className="space-y-3">
          <input
            value={block.title ?? ""}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            placeholder="Callout title (optional)"
            className={inputClasses}
            aria-label="Callout title"
          />
          <textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            rows={3}
            placeholder="Callout text"
            className={textareaClasses}
            aria-label="Callout text"
          />
        </div>
      )

    case "embed":
      return (
        <div className="space-y-3">
          <input
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            placeholder="Embed title"
            className={inputClasses}
            aria-label="Embed title"
          />
          <input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="https://"
            className={inputClasses}
            aria-label="Embed URL"
          />
          <input
            value={block.provider ?? ""}
            onChange={(e) => onChange({ ...block, provider: e.target.value })}
            placeholder="Provider (optional)"
            className={inputClasses}
            aria-label="Embed provider"
          />
        </div>
      )

    case "divider":
      return (
        <p className="text-sm text-muted-foreground">
          A horizontal rule. Nothing to configure.
        </p>
      )

    default:
      return null
  }
}

function InlineHint() {
  return (
    <p className="mt-2 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground/60">
      **bold** · *italic* · `code` · [text](/link)
    </p>
  )
}
