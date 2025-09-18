import './ProblemModal.css'
import { useState } from 'react'

type ProblemModalProps = {
  name: string
  isDone: boolean
  onClose: () => void
  onClear: () => void
  onUnclear: () => void
  onEdit: (newName: string) => void
}

function ProblemModal({
  name,
  isDone,
  onClose,
  onClear,
  onUnclear,
  onEdit
}: ProblemModalProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [newName, setNewName] = useState<string>()

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">문제 변경</h3>
        <div className="modal-buttons">
          {isEditMode ? (
            <>
              {/* 수정 모드 */}
              <input
                type="text"
                placeholder={name}
                onChange={e => setNewName(e.target.value)}
              />
              <button
                className="modal-button modal-button-edit"
                onClick={() => onEdit(newName || '')}>
                확인
              </button>
            </>
          ) : (
            <>
              {/* 기본 모드 */}
              {isDone ? (
                <button
                  className="modal-button modal-button-unclear"
                  onClick={onUnclear}>
                  리셋
                </button>
              ) : (
                <>
                  {name && (
                    <button
                      className="modal-button modal-button-clear"
                      onClick={onClear}>
                      클리어
                    </button>
                  )}
                </>
              )}
              <button
                className="modal-button modal-button-edit"
                onClick={() => setIsEditMode(true)}>
                수정
              </button>
            </>
          )}
        </div>
        <button
          className="modal-close-button"
          onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default ProblemModal
