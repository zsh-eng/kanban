import { markdown } from '@codemirror/lang-markdown';
import { EditorView, KeyBinding, keymap } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { vim } from '@replit/codemirror-vim';
import { createTheme } from '@uiw/codemirror-themes';
import CodeMirror from '@uiw/react-codemirror';
import { useCallback } from 'react';

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MarkdownEditor({
  content,
  onChange,
  className,
}: MarkdownEditorProps) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value);
    },
    [onChange]
  );

  const flexokiTheme = createTheme({
    theme: 'light',
    settings: {
      fontFamily: 'system-ui; sans-serif',
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      caret: 'var(--foreground)',
      selection: 'var(--background)',
      selectionMatch: 'var(--background)',
      gutterBackground: 'var(--background)',
      gutterForeground: 'var(--foreground)',
      gutterBorder: 'var(--background)',
      lineHighlight: 'var(--background)',
    },
    styles: [
      { tag: t.comment, color: 'var(--muted-foreground)' },
      { tag: t.heading, color: 'var(--muted-foreground)' },
      {
        tag: t.heading1,
        color: 'var(--muted-foreground)',
        class: 'text-2xl font-bold',
      },
      {
        tag: t.heading2,
        color: 'var(--muted-foreground)',
        class: 'text-xl font-bold',
      },
      {
        tag: t.heading3,
        color: 'var(--muted-foreground)',
        class: 'text-lg font-bold',
      },
      { tag: t.list, color: 'var(--foreground)' },
      { tag: t.quote, color: 'var(--muted-foreground)' },
      { tag: t.emphasis, fontStyle: 'italic' },
      { tag: t.strong, fontWeight: 'bold' },
    ],
  });

  const toggleCheckbox = (view: EditorView): boolean => {
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    const lineText = line.text;

    // Check if we're in a list item
    if (lineText.match(/^(\s*[-*+]\s+)/)) {
      const hasCheckbox = lineText.match(/^(\s*[-*+]\s+\[[ x]\])/);
      let newText: string;

      if (hasCheckbox) {
        // Toggle between [ ] and [x]
        newText = lineText.replace(/\[ \]/, '[x]').replace(/\[x\]/, '[ ]');
      } else {
        // Add checkbox if there isn't one
        newText = lineText.replace(/^(\s*[-*+]\s+)/, '$1[ ] ');
      }

      view.dispatch({
        changes: {
          from: line.from,
          to: line.to,
          insert: newText,
        },
      });
      return true;
    }
    return false;
  };

  const shortcuts: KeyBinding[] = [
    {
      key: 'Mod-l',
      run: toggleCheckbox,
      preventDefault: true,
    },
  ];

  return (
    <CodeMirror
      value={content}
      height='100%'
      extensions={[
        markdown(),
        vim(),
        EditorView.lineWrapping,
        keymap.of(shortcuts),
      ]}
      onChange={handleChange}
      className={className}
      theme={flexokiTheme}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
        highlightSelectionMatches: false,
        syntaxHighlighting: true,
      }}
    />
  );
}
