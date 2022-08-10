import { useReducer, useRef } from 'react'

export interface  IUseAutoCompleteData {
  name: string,
  icon: string,
}

interface IUseAutoCompleteParams {
  fetch: (name: string) => Promise<IUseAutoCompleteData[]>,
}

interface IUseAutoCompleteState {
  search: string,
  results: IUseAutoCompleteData[],
}

enum ReducerActionType {
  SET_SEARCH,
  SET_RESULTS,
  SELECT_ITEM,
}

interface ISetSearchAction {
  type: ReducerActionType.SET_SEARCH,
  payload: string
}

interface ISetResultsAction {
  type: ReducerActionType.SET_RESULTS,
  payload: IUseAutoCompleteData[]
}

interface ISelectItemAction {
  type: ReducerActionType.SELECT_ITEM,
  payload: string,
}

interface IMatchingIndex {
  start: number,
  end?: number,
}

type ReducerAction = ISetSearchAction | ISelectItemAction | ISetResultsAction

const useAutoCompleteReducer = (state: IUseAutoCompleteState, action: ReducerAction): IUseAutoCompleteState => {
  switch (action.type) {
    case ReducerActionType.SET_SEARCH:
      return { ...state, search: action.payload }
    case ReducerActionType.SET_RESULTS:
      return { ...state, results: action.payload }
    case ReducerActionType.SELECT_ITEM:
      return { ...state, search: action.payload, results: [] }
    default:
      return state
  }
}

export const getMatchingIndex = (name: string, search: string): IMatchingIndex => {
  const start = name.toLowerCase().indexOf(search.toLowerCase())
  return {
    start,
    ...(start >=0 && { end: start + search.length })
  }
}

export function useDebounce<T, TR>(func: (args: TR) => Promise<T[]>, delay: number): (args: TR) => Promise<T[]> {
  const timeoutRef = useRef<number>(0)

  return (args: TR) => {
    return new Promise((resolve) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        func(args)
          .then(results => resolve(results))
      }, delay)
    })
  }
}

export const useAutoComplete = ({ fetch }: IUseAutoCompleteParams) => {
  const [state, dispatch] = useReducer(useAutoCompleteReducer, {
    search: '',
    results: [],
  })

  const { search, results } = state

  const onSelectItem = (name: string): void => {
    dispatch({ type: ReducerActionType.SELECT_ITEM, payload: name })
  }

  const onSearchChange = (search: string) => {
    dispatch({ type: ReducerActionType.SET_SEARCH, payload: search })

    if (!search) {
      dispatch({ type: ReducerActionType.SET_RESULTS, payload: [] })
      return
    }

    fetch(search)
      .then((results) => dispatch({ type: ReducerActionType.SET_RESULTS, payload: results }))
  }

  return {
    search,
    results,
    onSearchChange,
    onSelectItem,
  }
}
