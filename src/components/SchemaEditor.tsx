import { ComponentProps, FC, useEffect } from "react"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, addToast } from "@heroui/react"
import { useMutation } from "@tanstack/react-query"
import { StrictOmit } from "soda-type"
import { v4 as uuid } from "uuid"

import { descriptionSchema } from "../schema/description"
import { nameSchema } from "../schema/name"
import { titleSchema } from "../schema/title"
import { typeSchema } from "../schema/type"
import { TypeEnum, typeEnumSchema } from "../schema/typeEnum"
import { useSchemas } from "../store/useSchemas"
import { isNonNullable } from "../utils/isNonNullable"
import ArraySchemaEditor from "./ArraySchemaEditor"
import BooleanSchemaEditor from "./BooleanSchemaEditor"
import { SchemaFormData, getDefaultValues, useAppForm } from "./FormContext"
import NullSchemaEditor from "./NullSchemaEditor"
import NumberSchemaEditor from "./NumberSchemaEditor"
import ObjectSchemaEditor from "./ObjectSchemaEditor"
import StringSchemaEditor from "./StringSchemaEditor"

const SchemaEditorMap: Record<TypeEnum, typeof ObjectSchemaEditor> = {
    object: ObjectSchemaEditor,
    array: ArraySchemaEditor,
    string: StringSchemaEditor,
    number: NumberSchemaEditor,
    boolean: BooleanSchemaEditor,
    null: NullSchemaEditor,
}

export interface SchemaEditorProps extends StrictOmit<ComponentProps<typeof Modal>, "children"> {
    schemaId?: string
}

const SchemaEditor: FC<SchemaEditorProps> = ({ schemaId, onClose, isOpen, ...rest }) => {
    const isUpdate = isNonNullable(schemaId)
    const form = useAppForm({
        defaultValues: isOpen && isUpdate ? (useSchemas.getState().find(item => item.id === schemaId) as unknown as SchemaFormData) : getDefaultValues(),
        async onSubmit({ value }) {
            await mutateAsync(value)
        },
    })

    useEffect(() => {
        if (!isOpen) return
        form.reset(isOpen && isUpdate ? (useSchemas.getState().find(item => item.id === schemaId) as unknown as SchemaFormData) : getDefaultValues())
    }, [form, isUpdate, isOpen])

    const { mutateAsync } = useMutation({
        async mutationFn(formData: SchemaFormData) {
            const id = isUpdate ? schemaId : uuid()
            const prev = isUpdate ? useSchemas.getState().find(item => item.id === id) : undefined
            const now = Date.now()
            if (formData.type === "object" && formData.properties?.some(({ title }) => !title?.trim())) {
                formData = { ...formData }
                formData.properties = formData.properties?.map(item =>
                    !!item.title?.trim()
                        ? item
                        : {
                              ...item,

                              title: useSchemas.getState().find(item2 => item2.id === item.id)!.title,
                          },
                )
            }
            const { data, error } = typeSchema.safeParse({ createdAt: now, ...prev, ...formData, updatedAt: now, id })
            if (error) throw new Error(JSON.stringify(error.errors.map(({ message }) => message)))
            if (isUpdate) useSchemas.setState(prev => prev.map(item => (item.id === id ? data : item)))
            else useSchemas.setState(prev => [...prev, data])
        },
        onSuccess(data, variables, context) {
            addToast({
                title: isUpdate ? "更新成功" : "新增成功",
                description: "Schema 已保存",
                color: "success",
            })
            onClose?.()
        },
        onError(error, variables, context) {
            const messages = JSON.parse(error.message) as string[]
            messages.forEach(message => {
                addToast({
                    title: "表单错误",
                    description: message,
                    color: "danger",
                })
            })
        },
    })

    return (
        <Modal isOpen={isOpen} onClose={onClose} {...rest}>
            <ModalContent>
                <ModalHeader>{isUpdate ? "编辑" : "新增"} Schema</ModalHeader>
                <ModalBody>
                    <form className="flex flex-col gap-2">
                        <form.AppField name="name" validators={{ onBlur: nameSchema }}>
                            {field => <field.Input label="名称" isRequired autoComplete="off" />}
                        </form.AppField>
                        <form.AppField name="title" validators={{ onBlur: titleSchema }}>
                            {field => <field.Input label="属性名" isRequired autoComplete="off" />}
                        </form.AppField>
                        <form.AppField name="type" validators={{ onBlur: typeEnumSchema }}>
                            {field => <field.TypeSelect label="类型" isRequired disallowEmptySelection />}
                        </form.AppField>
                        <form.AppField name="description" validators={{ onBlur: descriptionSchema }}>
                            {field => <field.Textarea label="描述" autoComplete="off" />}
                        </form.AppField>
                        <form.Subscribe selector={state => state.values.type}>
                            {type => {
                                const Editor = SchemaEditorMap[type as TypeEnum]
                                return <Editor form={form} />
                            }}
                        </form.Subscribe>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        取消
                    </Button>
                    <form.Subscribe selector={state => state.isSubmitting}>
                        {isSubmitting => (
                            <Button color="primary" onPress={() => form.handleSubmit()} isLoading={isSubmitting}>
                                提交
                            </Button>
                        )}
                    </form.Subscribe>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SchemaEditor
