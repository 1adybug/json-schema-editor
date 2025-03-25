import { ComponentProps, FC, ReactNode, useState } from "react"
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react"
import { StrictOmit } from "soda-type"

export interface PopconfirmProps extends StrictOmit<ComponentProps<typeof Popover>, "isOpen" | "onOpenChange" | "children" | "content"> {
    content?: ReactNode
    children?: ReactNode
    color?: ComponentProps<typeof Button>["color"]
    onConfirm?: () => void
    onCancel?: () => void
    confirmText?: ReactNode
    cancelText?: ReactNode
    confirmButtonProps?: ComponentProps<typeof Button>
    cancelButtonProps?: ComponentProps<typeof Button>
}

const Popconfirm: FC<PopconfirmProps> = props => {
    const {
        children,
        content,
        onConfirm: _onConfirm,
        onCancel: _onCancel,
        confirmText,
        cancelText,
        confirmButtonProps,
        cancelButtonProps,
        color,
        ...rest
    } = props
    const [isOpen, setIsOpen] = useState(false)

    function onConfirm() {
        setIsOpen(false)
        _onConfirm?.()
    }

    function onCancel() {
        setIsOpen(false)
        _onCancel?.()
    }

    return (
        <Popover {...rest} isOpen={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent>
                <div className="flex min-w-32 flex-col gap-4 p-1">
                    <div>{content}</div>
                    <div className="flex justify-end gap-2">
                        <Button className="h-6 min-w-fit text-xs" size="sm" onPress={onCancel} {...cancelButtonProps}>
                            {cancelText || "取消"}
                        </Button>
                        <Button className="h-6 min-w-fit text-xs" size="sm" color={color || "primary"} onPress={onConfirm} {...confirmButtonProps}>
                            {confirmText || "确定"}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default Popconfirm
