import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

/**
 * ErrorBoundary — catches render errors anywhere below it and shows a calm,
 * branded fallback instead of a blank white screen. Wraps the whole app.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div dir="rtl" className="grid min-h-screen place-items-center bg-cream px-6 text-center">
        <div>
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="ברכת אברהם"
            className="mx-auto h-16 w-auto"
          />
          <h1 className="mt-6 font-heading text-2xl font-bold text-ink">אירעה תקלה זמנית</h1>
          <p className="mt-2 text-ink-muted">אנא רעננו את העמוד ונסו שוב.</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-6">
            רענון העמוד
          </button>
        </div>
      </div>
    )
  }
}
