import { FC, Fragment } from "react"

import { isDevelopment } from "@/constants"

import font from "@/assets/fonts/SourceHanSansSC-VF.otf.woff2"

const Font: FC = () =>
    isDevelopment ? (
        <style>
            {`@font-face {
    font-family: "Source Han Sans VF";
    src: url("${font}") format("woff2");
    font-display: swap;
}
`}
        </style>
    ) : (
        <Fragment>
            <link
                rel="preload"
                as="style"
                crossOrigin="anonymous"
                href="https://static.zeoseven.com/zsft/68/main/result.css"
                onLoad={e => (e.currentTarget.rel = "stylesheet")}
                onError={e => (e.currentTarget.href = "https://static-host.zeoseven.com/zsft/68/main/result.css")}
            />
            <noscript>
                <link rel="stylesheet" href="https://static.zeoseven.com/zsft/68/main/result.css" />
            </noscript>
        </Fragment>
    )

export default Font
