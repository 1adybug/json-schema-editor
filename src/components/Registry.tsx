import { FC, ReactNode } from "react"
import { HeroUIProvider, ToastProvider } from "@heroui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export interface RegistryProps {
    children?: ReactNode
}

const queryClient = new QueryClient()

const Registry: FC<RegistryProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider>
                <ToastProvider />
                {children}
            </HeroUIProvider>
        </QueryClientProvider>
    )
}

export default Registry
