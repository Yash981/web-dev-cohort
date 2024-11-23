"use client"

import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Bold, Code, Heading1, Heading2, Italic, Link, List, ListOrdered, Quote, Underline } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"

export default function MarkdownEditor() {
  const [markdownText, setMarkdownText] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value)
  }

  const insertMarkdown = (startChars: string, endChars: string = '') => {
    if (textareaRef.current) {
      console.log(textareaRef.current,'textarea')
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const text = textareaRef.current.value
      const before = text.substring(0, start)
      const selection = text.substring(start, end)
      const after = text.substring(end)
      const newText = before + startChars + selection + endChars + after
      setMarkdownText(newText)
      
      // Set cursor position after insertion
      setTimeout(() => {
        textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd = 
          start + startChars.length + selection.length + endChars.length
        textareaRef.current!.focus()
      }, 0)
    }
  }
  console.log(markdownText,'textmarkdown ka')
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4 border rounded-lg shadow-md">
      <div className=" p-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('# ')}><Heading1 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('## ')}><Heading2 className="h-4 w-4" /></Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('**', '**')}><Bold className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('*', '*')}><Italic className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('__', '__')}><Underline className="h-4 w-4" /></Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('1. ')}><ListOrdered className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('- ')}><List className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('> ')}><Quote className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('[', '](url)')}><Link className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown('```', '```')}><Code className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center space-x-2">
          <Toggle className="text-sm"                aria-label="Toggle Write preview"
         pressed={!isPreview}             onPressedChange={()=>setIsPreview(false)}
          >Write</Toggle>
          <Toggle
            aria-label="Toggle preview"
            pressed={isPreview}
            onPressedChange={()=>setIsPreview(true)}
          >
            Preview
          </Toggle>
        </div>
      </div>
      <div className="min-h-[300px]">
        {isPreview ? (
          <div className=" p-4 rounded-b-lg prose prose-sm max-w-none min-h-[300px] overflow-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownText}</ReactMarkdown>
          </div>
        ) : (
          <Textarea
            ref={textareaRef}
            placeholder="Write your comment here using Markdown..."
            className="min-h-[300px] p-4 rounded-b-lg font-mono w-full"
            value={markdownText}
            onChange={handleTextChange}
          />
        )}
      </div>
    </div>
  )
}

