import { FC, FormEvent, useState } from "react"
import { Button, Form, Table, TableBody, TableCell, TableColumn, TableColumnProps, TableHeader, TableRow, addToast } from "@heroui/react"
import { SortDirection } from "@react-types/shared"
import { createFormHookContexts } from "@tanstack/react-form"
import { copy } from "clipboard"
import { formatTime, satisfyKeyword } from "deepsea-tools"
import { v4 as uuid } from "uuid"

import { useAppForm } from "./components/FormContext"
import Popconfirm from "./components/Popconfirm"
import SchemaEditor from "./components/SchemaEditor"
import { SchemaNameMap } from "./constants"
import { JsonSchema } from "./schema/type"
import { TypeEnum, typeEnumSchema } from "./schema/typeEnum"
import { useSchemas } from "./store/useSchemas"
import { exportSchema } from "./utils/exportSchema"

function compare(a: JsonSchema, b: JsonSchema, column: string | number, direction: SortDirection) {
    let result = 0
    if (column === "name") result = a.name.localeCompare(b.name)
    else if (column === "type") result = Object.keys(SchemaNameMap).indexOf(a.type) - Object.keys(SchemaNameMap).indexOf(b.type)
    else if (column === "createdAt") result = a.createdAt - b.createdAt
    else if (column === "updatedAt") result = a.updatedAt - b.updatedAt
    if (direction === "descending") result *= -1
    return result
}

const App: FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [schemaId, setSchemaId] = useState<string>()
    const [schemas, setSchemas] = useSchemas()
    const [query, setQuery] = useState({
        type: undefined as TypeEnum | undefined,
        name: "",
    })

    const form = useAppForm({
        defaultValues: {} as typeof query,
        onSubmit({ value }) {
            setQuery(value)
        },
    })

    const columns: TableColumnProps<JsonSchema>[] = [
        {
            key: "index",
            width: 160,
            children: "序号",
        },
        {
            key: "name",
            width: 320,
            children: "名称",
        },
        {
            key: "title",
            width: 240,
            children: "属性名",
        },
        {
            key: "type",
            width: 160,
            children: "类型",
        },
        {
            key: "description",
            children: "描述",
        },
        {
            key: "createdAt",
            width: 200,
            children: "创建时间",
        },
        {
            key: "updatedAt",
            width: 200,
            children: "更新时间",
        },
        {
            key: "actions",
            width: 320,
            children: "操作",
        },
    ]

    function createSchema() {
        setIsOpen(true)
        setSchemaId(undefined)
    }

    function editSchema(id: string) {
        setIsOpen(true)
        setSchemaId(id)
    }

    function copySchema(id: string) {
        const schema = schemas.find(item => item.id === id)!
        const now = Date.now()
        const newSchema = { ...schema, id: uuid(), createdAt: now, updatedAt: now }
        const reg = /_(\d+)$/
        const match = schema.name.match(reg)
        if (match) newSchema.name = schema.name.replace(reg, `_${Number(match[1]) + 1}`)
        else newSchema.name = `${schema.name}_1`
        setSchemas(prev => [...prev, newSchema])
    }

    function deleteSchema(id: string) {
        setSchemas(prev => prev.filter(item => item.id !== id))
        addToast({
            title: "删除成功",
            color: "success",
        })
    }

    return (
        <div className="flex flex-col gap-8 p-8">
            <div className="flex items-center">
                <Form className="flex flex-none flex-row gap-2">
                    <form.AppField name="type">
                        {field => <field.TypeSelect className="w-40 flex-none" label="类型" labelPlacement="outside-left" disallowEmptySelection={false} />}
                    </form.AppField>
                    <form.AppField name="name">
                        {field => <field.Input className="w-60 flex-none" label="名称" labelPlacement="outside-left" autoComplete="off" />}
                    </form.AppField>
                    <Button color="primary" type="button" onPress={() => form.handleSubmit()}>
                        搜索
                    </Button>
                    <Button className="text-primary-800" variant="light" type="button" onPress={() => form.reset()}>
                        重置
                    </Button>
                </Form>
                <div className="ml-auto">
                    <SchemaEditor size="2xl" isOpen={isOpen} onClose={() => setIsOpen(false)} schemaId={schemaId} />
                    <Button onPress={createSchema}>新增</Button>
                </div>
            </div>
            <div>
                <Table aria-label="schema-table">
                    <TableHeader columns={columns}>{column => <TableColumn {...column} key={column.key} align="center" />}</TableHeader>
                    <TableBody
                        items={schemas
                            .filter(item => (query.type ? item.type === query.type : true && query.name ? satisfyKeyword(item.name, query.name) : true))
                            .map((item, index) => ({ ...item, index }))}
                        emptyContent={<span className="text-sm">暂无数据</span>}
                    >
                        {({ id, name, type, title, description, index, createdAt, updatedAt }) => (
                            <TableRow key={id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{name}</TableCell>
                                <TableCell>{title}</TableCell>
                                <TableCell>{SchemaNameMap[type]}</TableCell>
                                <TableCell>{description || "-"}</TableCell>
                                <TableCell>{formatTime(createdAt)}</TableCell>
                                <TableCell>{formatTime(updatedAt)}</TableCell>
                                <TableCell>
                                    <div className="flex w-full justify-center gap-2">
                                        <Button
                                            className="text-black text-opacity-65 disabled:cursor-not-allowed disabled:text-opacity-45"
                                            disabled={index === 0}
                                            size="sm"
                                            variant="bordered"
                                            onPress={() => setSchemas(prev => prev.with(index, prev[index - 1]).with(index - 1, prev[index]))}
                                        >
                                            上移
                                        </Button>
                                        <Button
                                            className="text-black text-opacity-65 disabled:cursor-not-allowed disabled:text-opacity-45"
                                            disabled={index === schemas.length - 1}
                                            size="sm"
                                            variant="bordered"
                                            onPress={() => setSchemas(prev => prev.with(index, prev[index + 1]).with(index + 1, prev[index]))}
                                        >
                                            下移
                                        </Button>
                                        <Button size="sm" onPress={() => copySchema(id)}>
                                            复制
                                        </Button>
                                        <Button size="sm" color="success" onPress={() => copy(JSON.stringify(exportSchema(id), null, 4))}>
                                            导出
                                        </Button>
                                        <Button color="primary" size="sm" onPress={() => editSchema(id)}>
                                            编辑
                                        </Button>
                                        <Popconfirm content="确定删除吗？" color="danger" onConfirm={() => deleteSchema(id)}>
                                            <Button color="danger" size="sm">
                                                删除
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default App
