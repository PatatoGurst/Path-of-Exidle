import type { EditorMode } from './TreeEditorRenderer'
import './TreeEditorToolbar.css'

interface Props {
  files: string[]
  currentFile: string | null
  onSelectFile: (name: string) => void
  onNewFile: () => void
  dirty: boolean
  onSave: () => void
  mode: EditorMode
  onModeChange: (mode: EditorMode) => void
  hasSelection: boolean
  onDelete: () => void
  showThemes: boolean
  onToggleShowThemes: () => void
  onManageThemes: () => void
}

export function TreeEditorToolbar({
  files,
  currentFile,
  onSelectFile,
  onNewFile,
  dirty,
  onSave,
  mode,
  onModeChange,
  hasSelection,
  onDelete,
  showThemes,
  onToggleShowThemes,
  onManageThemes,
}: Props) {
  return (
    <div className="tree-editor-toolbar">
      <div className="tree-editor-toolbar__group">
        <select
          className="tree-editor-toolbar__select"
          value={currentFile ?? ''}
          onChange={(e) => onSelectFile(e.target.value)}
        >
          {!currentFile && <option value="">Select a tree…</option>}
          {files.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <button className="tree-editor-toolbar__btn" onClick={onNewFile}>
          New Tree
        </button>
      </div>

      <div className="tree-editor-toolbar__group">
        <button
          className={`tree-editor-toolbar__btn tree-editor-toolbar__btn--toggle ${mode === 'add-node' ? 'tree-editor-toolbar__btn--active' : ''}`}
          onClick={() => onModeChange(mode === 'add-node' ? 'select' : 'add-node')}
        >
          Add Node
        </button>
        <button className="tree-editor-toolbar__btn" disabled={!hasSelection} onClick={onDelete}>
          Delete
        </button>
        <button
          className={`tree-editor-toolbar__btn tree-editor-toolbar__btn--toggle ${showThemes ? 'tree-editor-toolbar__btn--active' : ''}`}
          onClick={onToggleShowThemes}
        >
          Show Themes
        </button>
        <button className="tree-editor-toolbar__btn" onClick={onManageThemes}>
          Manage Themes
        </button>
      </div>

      <div className="tree-editor-toolbar__group">
        {dirty && <span className="tree-editor-toolbar__dirty">Unsaved changes</span>}
        <button
          className="tree-editor-toolbar__btn tree-editor-toolbar__btn--save"
          disabled={!currentFile || !dirty}
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}
