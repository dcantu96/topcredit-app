import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { RecoilRoot } from "recoil"
import App from "app/app"
import "./index.css"
import { ErrorBoundary } from "react-error-boundary"
import FullScreenError from "./components/molecules/error"

const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <ErrorBoundary fallbackRender={FullScreenError}>
        <App />
      </ErrorBoundary>
    ),
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
)
