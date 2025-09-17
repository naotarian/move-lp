/**
 * ページ訪問履歴を追跡するユーティリティ
 */

const VISITED_PAGES_KEY = 'visitedPages'
const RETURNING_FROM_CONFIRMATION_KEY = 'returningFromConfirmation'
const MAX_HISTORY_SIZE = 10

interface PageVisit {
  path: string
  timestamp: number
}

/**
 * 現在のページを訪問履歴に追加
 */
export const trackPageVisit = (path: string) => {
  if (typeof window === 'undefined') return

  try {
    const history = getPageVisitHistory()

    // 同じページが連続で訪問された場合は追加しない
    const lastVisit = history[history.length - 1]
    if (lastVisit && lastVisit.path === path) {
      return
    }

    const newVisit: PageVisit = {
      path,
      timestamp: Date.now(),
    }

    history.push(newVisit)

    // 履歴サイズを制限
    if (history.length > MAX_HISTORY_SIZE) {
      history.shift()
    }

    sessionStorage.setItem(VISITED_PAGES_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('ページ訪問履歴の保存エラー:', error)
  }
}

/**
 * ページ訪問履歴を取得
 */
export const getPageVisitHistory = (): PageVisit[] => {
  if (typeof window === 'undefined') return []

  try {
    const history = sessionStorage.getItem(VISITED_PAGES_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('ページ訪問履歴の取得エラー:', error)
    return []
  }
}

/**
 * 確認画面から戻ってきたかどうかを判定
 */
export const isReturningFromConfirmation = (): boolean => {
  const history = getPageVisitHistory()

  if (history.length < 2) return false

  const lastVisit = history[history.length - 1]
  const secondLastVisit = history[history.length - 2]

  // 最後の訪問が確認画面で、その前が入力画面の場合
  // かつ、時間差が短い場合（5分以内）は確認画面からの戻りと判定
  const timeDiff = lastVisit.timestamp - secondLastVisit.timestamp
  const isRecentReturn = timeDiff < 5 * 60 * 1000 // 5分以内

  return lastVisit.path === '/estimate/confirmation' && secondLastVisit.path === '/estimate' && isRecentReturn
}

/**
 * 直前に確認画面を訪問していたかどうかを判定
 */
export const wasLastVisitConfirmation = (): boolean => {
  const history = getPageVisitHistory()

  if (history.length === 0) return false

  const lastVisit = history[history.length - 1]
  return lastVisit.path === '/estimate/confirmation'
}

/**
 * 確認画面からの戻りフラグを設定
 */
export const setReturningFromConfirmation = (value: boolean) => {
  if (typeof window === 'undefined') return

  try {
    if (value) {
      sessionStorage.setItem(RETURNING_FROM_CONFIRMATION_KEY, 'true')
    } else {
      sessionStorage.removeItem(RETURNING_FROM_CONFIRMATION_KEY)
    }
  } catch (error) {
    console.error('確認画面からの戻りフラグ設定エラー:', error)
  }
}

/**
 * 確認画面からの戻りフラグを取得
 */
export const getReturningFromConfirmation = (): boolean => {
  if (typeof window === 'undefined') return false

  try {
    return sessionStorage.getItem(RETURNING_FROM_CONFIRMATION_KEY) === 'true'
  } catch (error) {
    console.error('確認画面からの戻りフラグ取得エラー:', error)
    return false
  }
}

/**
 * 現在のURLが確認画面かどうかを判定
 */
export const isCurrentPageConfirmation = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.location.pathname === '/estimate/confirmation'
}

/**
 * 訪問履歴をクリア
 */
export const clearPageVisitHistory = () => {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.removeItem(VISITED_PAGES_KEY)
    sessionStorage.removeItem(RETURNING_FROM_CONFIRMATION_KEY)
  } catch (error) {
    console.error('ページ訪問履歴のクリアエラー:', error)
  }
}
