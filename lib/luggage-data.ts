// 荷物マスタデータの型定義
export interface LuggageCategory {
  id: string
  code: string
  name: string
  nameEn?: string
  description?: string
  sortOrder: number
}

export interface LuggageItem {
  id: string
  code: string
  name: string
  subLabel?: string
  categoryId: string
  categoryCode: string
  categoryName: string
  description?: string
  basePrice?: number
  sortOrder: number
}

export interface LuggageCategoryWithItems extends LuggageCategory {
  items: Omit<LuggageItem, 'categoryId' | 'categoryCode' | 'categoryName'>[]
}

// データキャッシュ
let categoriesCache: LuggageCategory[] | null = null
let masterCache: LuggageItem[] | null = null
let combinedCache: LuggageCategoryWithItems[] | null = null

/**
 * カテゴリーデータを取得
 */
export async function getLuggageCategories(): Promise<LuggageCategory[]> {
  if (categoriesCache) {
    return categoriesCache
  }

  try {
    const response = await fetch('/json/luggage-categories.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    categoriesCache = await response.json()
    console.log(categoriesCache)
    return categoriesCache
  } catch (error) {
    console.error('Failed to load luggage categories:', error)
    // フォールバック: 空の配列を返す
    return []
  }
}

/**
 * 荷物マスタデータを取得
 */
export async function getLuggageMaster(): Promise<LuggageItem[]> {
  if (masterCache) {
    return masterCache
  }

  try {
    const response = await fetch('/json/luggage-master.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    masterCache = await response.json()
    return masterCache
  } catch (error) {
    console.error('Failed to load luggage master:', error)
    // フォールバック: 空の配列を返す
    return []
  }
}

/**
 * 統合データを取得（カテゴリー別にグループ化）
 */
export async function getLuggageData(): Promise<LuggageCategoryWithItems[]> {
  if (combinedCache) {
    return combinedCache
  }

  try {
    const response = await fetch('/json/luggage-data.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    combinedCache = await response.json()
    return combinedCache
  } catch (error) {
    console.error('Failed to load luggage data:', error)
    // フォールバック: 空の配列を返す
    return []
  }
}

/**
 * 特定のカテゴリーの荷物を取得
 */
export async function getLuggageByCategory(categoryCode: string): Promise<LuggageItem[]> {
  const masterData = await getLuggageMaster()
  return masterData.filter((item) => item.categoryCode === categoryCode)
}

/**
 * 荷物コードで荷物を検索
 */
export async function getLuggageByCode(code: string): Promise<LuggageItem | null> {
  const masterData = await getLuggageMaster()
  return masterData.find((item) => item.code === code) || null
}

/**
 * 荷物IDで荷物を検索
 */
export async function getLuggageById(id: string): Promise<LuggageItem | null> {
  const masterData = await getLuggageMaster()
  return masterData.find((item) => item.id === id) || null
}

/**
 * カテゴリーコードでカテゴリーを検索
 */
export async function getCategoryByCode(code: string): Promise<LuggageCategory | null> {
  const categories = await getLuggageCategories()
  return categories.find((category) => category.code === code) || null
}

/**
 * カテゴリーIDでカテゴリーを検索
 */
export async function getCategoryById(id: string): Promise<LuggageCategory | null> {
  const categories = await getLuggageCategories()
  return categories.find((category) => category.id === id) || null
}

/**
 * キャッシュをクリア
 */
export function clearLuggageDataCache(): void {
  categoriesCache = null
  masterCache = null
  combinedCache = null
}

/**
 * データをプリロード（初期化時に呼び出し）
 */
export async function preloadLuggageData(): Promise<void> {
  try {
    await Promise.all([getLuggageCategories(), getLuggageMaster(), getLuggageData()])
  } catch (error) {
    console.error('Failed to preload luggage data:', error)
  }
}
