import './Problem.css'
import { db } from './Firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useState, useCallback, useEffect } from 'react'
import clearStampImsage from '../assets/clear_stamp.png'

type ProblemProps = {
  id: string
  name: string
  isDone: boolean
}

type ProblemState = {
  isCompleted: boolean
  showModal: boolean
  showModify: boolean
}

// 상수 정의
const BUTTON_TYPES = {
  CLEAR: 'clear',
  RESET: 'reset',
  EDIT: 'edit',
  CONFIRM: 'confirm'
} as const

type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES]

// 저장 함수 예시
export async function saveProblemName(problemId: string, name: string) {
  await updateDoc(doc(db, 'problems', problemId), { name: name })
}

// 완료/리셋 토글
export async function setProblemDone(problemId: string, isDone: boolean) {
  await updateDoc(doc(db, 'problems', problemId), { isDone: isDone })
}

function Problem({ id, name: propName, isDone }: ProblemProps) {
  const [inputValue, setInputValue] = useState<string>('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const [name, setName] = useState<string>('')

  useEffect(() => {
    setName(propName)
    setProblemState(prev => ({ ...prev, isCompleted: isDone }))
  }, [propName, isDone])

  // 버튼 클릭 시 실행
  const handleConfirmNameChange = async () => {
    const next = inputValue.trim()
    setName(next)
    await saveProblemName(id, next)
    closeModal()
  }

  const [problemState, setProblemState] = useState<ProblemState>({
    isCompleted: isDone,
    showModal: false,
    showModify: false
  })

  // 상태 업데이트 헬퍼 함수
  const updateState = useCallback((updates: Partial<ProblemState>) => {
    setProblemState(prev => ({ ...prev, ...updates }))
  }, [])

  // 모달 열기
  const openModal = useCallback(() => {
    updateState({ showModal: true })
  }, [updateState])

  // 모달 닫기
  const closeModal = useCallback(() => {
    updateState({ showModal: false, showModify: false })
  }, [updateState])

  const modifyProblemName = useCallback(() => {
    updateState({ showModify: true })
  }, [updateState])

  // 문제 완료 처리
  const completeProblem = useCallback(() => {
    updateState({ isCompleted: true, showModal: false })
    setProblemDone(id, true)
  }, [updateState, id])

  // 문제 리셋 처리
  const resetProblem = useCallback(() => {
    updateState({ isCompleted: false, showModal: false })
    setProblemDone(id, false)
  }, [updateState, id])

  // 모달 외부 클릭 처리
  const handleModalOverlayClick = useCallback(() => {
    closeModal()
  }, [closeModal])

  // 모달 내용 클릭 시 이벤트 전파 방지
  const handleModalContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  // 버튼 클릭 핸들러
  const handleButtonClick = useCallback(
    (type: ButtonType) => {
      switch (type) {
        case BUTTON_TYPES.CLEAR:
          completeProblem()
          break
        case BUTTON_TYPES.RESET:
          resetProblem()
          break
        case BUTTON_TYPES.EDIT:
          modifyProblemName()
          break
        default:
          break
      }
    },
    [completeProblem, resetProblem, modifyProblemName]
  )

  // 버튼 컴포넌트
  const ModalButton = ({
    type,
    label
  }: {
    type: ButtonType
    label: string
  }) => (
    <button
      onClick={() => handleButtonClick(type)}
      className={`modal-button modal-button-${type}`}
      aria-label={label}>
      {label}
    </button>
  )

  return (
    <div className="problem-container">
      {/* 메인 버튼 */}
      <button
        className="problem problem-button"
        onClick={openModal}
        aria-expanded={problemState.showModal}>
        {name}
      </button>
      {/* 완료 스탬프 */}
      {problemState.isCompleted && (
        <div
          className="clear_stamp_overlay"
          role="img"
          aria-label="완료 표시">
          <img
            src={clearStampImsage}
            alt="완료 스탬프"
            className="clear_stamp_image"
          />
        </div>
      )}
      {/* 모달창 */}
      {problemState.showModal && (
        <div
          className="modal-overlay"
          onClick={handleModalOverlayClick}
          role="dialog"
          aria-modal="true">
          <div
            className="modal-content"
            onClick={handleModalContentClick}>
            <h3 className="modal-title">{name || <>문제</>}</h3>
            <div
              className="modal-buttons"
              role="group"
              aria-label="문제 액션">
              {problemState.showModify ? (
                <>
                  <input
                    type="text"
                    value={inputValue}
                    placeholder={name}
                    onChange={handleChange}
                  />
                  {/* 버튼 */}
                  <button onClick={handleConfirmNameChange}>확인</button>
                </>
              ) : problemState.isCompleted ? (
                <>
                  <ModalButton
                    type={BUTTON_TYPES.RESET}
                    label="리셋"
                  />
                  <ModalButton
                    type={BUTTON_TYPES.EDIT}
                    label="수정"
                  />
                </>
              ) : (
                <>
                  <ModalButton
                    type={BUTTON_TYPES.CLEAR}
                    label="클리어"
                  />
                  <ModalButton
                    type={BUTTON_TYPES.EDIT}
                    label="수정"
                  />
                </>
              )}
            </div>

            <button
              onClick={closeModal}
              className="modal-close-button"
              aria-label="모달 닫기">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Problem
