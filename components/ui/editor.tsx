"use client";

import {useEditor, EditorContent, Editor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {cn} from "@/lib/utils";

export function JournalEditor ({content, onUpdate}: {
    content: string;
    onUpdate: (html:string) => void;
}) {
    const editor = useEditor({
        extensions: [
            StarterKit, 
            Placeholder.configure({
                placeholder: "Start writing your thoughts...",
            }),
        ],
        content,
        autofocus: true,
        onUpdate: ({editor}) => {
            onUpdate(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "focus:outline-none font-serif text-lg leading-relaxed text-white caret-orange-400"
            }
        }
    })

    return (
        <div className="prose prose-inverse max-w-full">
            <EditorContent editor={editor} className="min-h-[50vh] pb-40" />
        </div>
    )
}