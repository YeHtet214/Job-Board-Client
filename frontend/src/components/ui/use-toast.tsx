import { useEffect, useState } from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ToasterToast = ToastProps & {
    id: string
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
}

const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_VALUE
    return count.toString()
}

type ActionType = typeof actionTypes

type Action =
    | {
          type: ActionType['ADD_TOAST']
          toast: ToasterToast
      }
    | {
          type: ActionType['UPDATE_TOAST']
          toast: Partial<ToasterToast>
      }
    | {
          type: ActionType['DISMISS_TOAST']
          toastId?: ToasterToast['id']
      }
    | {
          type: ActionType['REMOVE_TOAST']
          toastId?: ToasterToast['id']
      }

interface State {
    toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            }

        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action

            // ! Side effects ! - This could be extracted into a dismissToast() action,
            // but I'll keep it here for simplicity
            if (toastId) {
                addToRemoveQueue(toastId)
            } else {
                state.toasts.forEach((toast) => {
                    addToRemoveQueue(toast.id)
                })
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                              ...t,
                              open: false,
                          }
                        : t
                ),
            }
        }
        case actionTypes.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                }
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            }
    }
}

function addToRemoveQueue(toastId: string) {
    if (toastTimeouts.has(toastId)) {
        return
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({
            type: actionTypes.REMOVE_TOAST,
            toastId: toastId,
        })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

type Toast = Omit<ToasterToast, 'id'>

function createToast(props: Toast) {
    const id = genId()

    const update = (props: ToasterToast) =>
        dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...props, id },
        })
    const dismiss = () =>
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open: boolean) => {
                if (!open) dismiss()
            },
        },
    })

    return {
        id: id,
        dismiss,
        update,
    }
}

type UseToast = {
    toast: (props: Toast) => {
        id: string
        dismiss: () => void
        update: (props: ToasterToast) => void
    }
    dismiss: (toastId?: string) => void
    toasts: ToasterToast[]
}

const [state, dispatch] = createStore({
    toasts: [],
})

function createStore(initialState: State) {
    const listeners: Set<() => void> = new Set()
    let state = initialState

    const setState = (partial: State | ((state: State) => State)) => {
        const nextState =
            typeof partial === 'function' ? partial(state) : partial
        if (!Object.is(nextState, state)) {
            state = { ...state, ...nextState }
            listeners.forEach((listener) => listener())
        }
    }

    const getState = () => state

    const subscribe = (listener: () => void) => {
        listeners.add(listener)
        return () => {
            listeners.delete(listener)
        }
    }

    const dispatch = (action: Action) => {
        setState((state) => reducer(state, action))
    }

    return [
        {
            get toasts() {
                return getState().toasts
            },
            subscribe,
        },
        dispatch,
    ] as const
}

export function useToast(): UseToast {
    const [toastState, setToastState] = useState<ToasterToast[]>([])

    useEffect(() => {
        return state.subscribe(() => {
            setToastState([...state.toasts])
        })
    }, [])

    return {
        toast: createToast,
        dismiss: (toastId?: string) =>
            dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
        toasts: toastState,
    }
}
