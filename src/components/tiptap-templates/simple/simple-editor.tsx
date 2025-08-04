"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// Tiptap Core Extensions
import { StarterKit } from "@tiptap/starter-kit"
// import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// UI Primitives
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// Custom Nodes
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// UI Elements
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// Icons
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// Hooks
import { useIsMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// Lib
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import ImageResize from 'tiptap-extension-resize-image';

// Styles
import "@/components/tiptap-templates/simple/simple-editor.scss"
import content from "@/components/tiptap-templates/simple/data/content.json"
//table
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'

import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"

// Types
interface SimpleEditorProps {
  content?: object; 
  onContentChange: (content: object) => void;
}

interface MainToolbarContentProps {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}

interface MobileToolbarContentProps {
  type: "highlighter" | "link";
  onBack: () => void;
}

export function SimpleEditor({
  content: initialContent,
  onContentChange,
}: SimpleEditorProps) {
  const isMobile = useIsMobile()
  const windowSize = useWindowSize()
  const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: "simple-editor",
        "aria-label": "Main content area, start typing to enter text.",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
        TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
        Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      ImageResize,
      // Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: initialContent || content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onContentChange(json)
    },
  })

  React.useEffect(() => {
    if (editor && initialContent) {
      const currentContent = editor.getJSON()
      if (JSON.stringify(currentContent) !== JSON.stringify(initialContent)) {
        editor.commands.setContent(initialContent)
      }
    }
  }, [editor, initialContent])

  const bodyRect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const MainToolbarContent: React.FC<MainToolbarContentProps> = React.useCallback(({
    onHighlighterClick,
    onLinkClick,
    isMobile,
  }) => (
    <>
      <Spacer />
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu 
          types={["bulletList", "orderedList", "taskList"]} 
          portal={isMobile} 
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? (
          <LinkPopover />
        ) : (
          <LinkButton onClick={onLinkClick} />
        )}
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>
      <Spacer />
      {isMobile && <ToolbarSeparator />}
    </>
  ), [])

  const MobileToolbarContent: React.FC<MobileToolbarContentProps> = React.useCallback(({
    type,
    onBack,
  }) => (
    <>
      <ToolbarGroup>
        <Button data-style="ghost" onClick={onBack}>
          <ArrowLeftIcon className="tiptap-button-icon" />
          {type === "highlighter" ? (
            <HighlighterIcon className="tiptap-button-icon" />
          ) : (
            <LinkIcon className="tiptap-button-icon" />
          )}
        </Button>
      </ToolbarGroup>
      <ToolbarSeparator />
      {type === "highlighter" ? (
        <ColorHighlightPopoverContent />
      ) : (
        <LinkContent />
      )}
    </>
  ), [])

  const setColor = (color: string) => {
  editor?.chain().focus().setColor(color).run()
}

const colors = [
  { name: "Red", value: "#f44336" },
  { name: "Green", value: "#4caf50" },
  { name: "Blue", value: "#2196f3" },
  { name: "Orange", value: "#ff9800" },
  { name: "Purple", value: "#9c27b0" },
  { name: "Black", value: "#000000" },
]

  return (
    <div className="simple-editor-wrapper">
      <div className="flex gap-2 my-1 justify-center mr-2">
  {colors.map((color) => (
    <div
      key={color.name}
      onClick={() => setColor(color.value)}
      className="relative w-5 h-5 rounded cursor-pointer border border-gray-300"
      style={{ backgroundColor: color.value }}
    >
    </div>
  ))}
</div>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={
            isMobile 
              ? { bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)` } 
              : {}
          }
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>
        <EditorContent 
          editor={editor} 
          role="presentation" 
          className="simple-editor-content prose max-w-none
    [&_table]:border [&_table]:border-collapse [&_table]:border-gray-100
    [&_th]:border [&_td]:border 
    [&_th]:border-gray-100 [&_td]:border-gray-100
    [&_th]:px-4 [&_td]:px-4 [&_th]:py-3 [&_td]:py-3
    [&_th]:bg-gray-100" 
        />
      </EditorContext.Provider>
    </div>
  )
}