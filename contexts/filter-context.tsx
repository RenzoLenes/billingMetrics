// contexts/filter-context.tsx
'use client'

import { createContext, useContext, useState } from 'react'

type DateRange = {
  from: Date
  to: Date
}

type FilterContextType = {
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
  documentType: string
  setDocumentType: (type: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}

const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1); // Primer día del mes actual
};

const getEndOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último día del mes actual
};




const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: getStartOfMonth(),
    to: getEndOfMonth(),
  });

  const [documentType, setDocumentType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <FilterContext.Provider
      value={{
        dateRange,
        setDateRange,
        documentType,
        setDocumentType,
        searchTerm,
        setSearchTerm
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}