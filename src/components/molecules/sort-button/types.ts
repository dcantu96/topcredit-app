export type SortOption = "asc" | "desc" | undefined

export interface SortButtonProps {
  onSortChange: (sort: SortOption) => void
  sortOrder: SortOption
  options?: { label: string; value: SortOption }[]
}
