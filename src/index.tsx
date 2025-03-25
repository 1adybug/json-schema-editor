import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import App from "./App"
import Registry from "./components/Registry"

import "./index.css"

import Font from "./components/Font"

// /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
    <StrictMode>
        <Font />
        <Registry>
            <App />
        </Registry>
    </StrictMode>,
)
