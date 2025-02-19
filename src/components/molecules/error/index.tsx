import { CustomError } from "components/providers/auth/ProtectedRoute"

interface FullScreenErrorProps {
  error: CustomError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetErrorBoundary: (...args: any[]) => void
}

function FullScreenError({ error, resetErrorBoundary }: FullScreenErrorProps) {
  if (error.code === 403 || error.code === 401) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
          <svg
            className="mx-auto h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Acceso Denegado
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            No tienes permiso para acceder a esta página.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            {error.code === 403
              ? "No tienes los permisos necesarios."
              : "Necesitas iniciar sesión."}
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            ¡Ups! Algo salió mal.
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Encontramos un error inesperado. Por favor, inténtalo de nuevo.
          </p>

          <div className="mt-6">
            <button
              onClick={resetErrorBoundary}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Intentar de Nuevo
            </button>
          </div>

          <details className="mt-2">
            <summary className="cursor-pointer text-blue-500 hover:underline text-sm">
              Mostrar Detalles
            </summary>
            <pre className="text-xs text-gray-500 mt-2 overflow-x-auto p-4 bg-gray-50 rounded border border-gray-200">
              {error.stack}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}

export default FullScreenError
