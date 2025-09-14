import './Problem.css'
import { db } from './Firebase'
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore'
import { useState, useCallback, useEffect } from 'react'
import clearStampImsage from '../assets/clear_stamp.png'

type ProblemProps = {
  id: number
  onNameChange?: (id: number, hasName: boolean) => void
  onCompleteChange?: (id: number, completed: boolean) => void // ✅ 추가
}

type ProblemState = {
  isCompleted: boolean
  showModal: boolean
  showModify: boolean
}

const problemDocRef = (problemId: number) =>
  doc(db, 'problems', String(problemId))

export async function saveProblemName(problemId: number, name: string) {
  // merge:true 로 다른 필드가 있어도 안전
  await setDoc(problemDocRef(problemId), { name }, { merge: true })
}

export function watchProblemName(
  problemId: number,
  onChange: (name: string | null) => void
) {
  return onSnapshot(problemDocRef(problemId), snap => {
    const data = snap.data()
    onChange(data?.name ?? null)
  })
}

export async function fetchProblemNameOnce(problemId: number) {
  const snap = await getDoc(problemDocRef(problemId))
  return snap.exists() ? (snap.data().name as string) : null
}

// 상수 정의
const BUTTON_TYPES = {
  CLEAR: 'clear',
  RESET: 'reset',
  EDIT: 'edit',
  CONFIRM: 'confirm'
} as const

type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES]

function Problem({ id, onCompleteChange, onNameChange }: ProblemProps) {
  const [inputValue, setInputValue] = useState<string>('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const [name, setName] = useState<string>('')
  // 버튼 클릭 시 실행
  const handleConfirmNameChange = async () => {
    const next = inputValue.trim()
    if (next.length === 0) return
    await saveProblemName(id, next)
    // 저장하면 watch가 발화하여 name이 갱신됨
    closeModal()
  }

  useEffect(() => {
    const ref = doc(db, 'problems', 'problemId_' + String(id))
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        console.log(id)
        console.log(snap.data())
        setName(snap.data().name ?? '')
        onNameChange?.(id, snap.data().name)
      }
    })
    return () => unsub()
  }, [id, onNameChange])

  const [problemState, setProblemState] = useState<ProblemState>({
    isCompleted: false,
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
    updateState({ showModal: false })
    updateState({ showModify: false })
  }, [updateState])

  const modifyProblemName = useCallback(() => {
    updateState({ showModify: true })
  }, [updateState])

  // 문제 완료 처리
  const completeProblem = useCallback(() => {
    updateState({ isCompleted: true, showModal: false })
    onCompleteChange?.(id, true)
  }, [updateState, id, onCompleteChange])

  // 문제 리셋 처리
  const resetProblem = useCallback(() => {
    updateState({ isCompleted: false, showModal: false })
    onCompleteChange?.(id, false) // ✅ 부모에 알림
  }, [updateState, id, onCompleteChange])

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
        aria-label={`문제 ${id}`}
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
          aria-modal="true"
          aria-labelledby={`problem-title-${id}`}>
          <div
            className="modal-content"
            onClick={handleModalContentClick}>
            <h3
              id={`problem-title-${id}`}
              className="modal-title">
              {name || <>문제</>}
            </h3>

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
