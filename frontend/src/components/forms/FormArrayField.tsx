import React from 'react'
import { FieldArray, useFormikContext } from 'formik'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type FormArrayFieldProps = {
    name: string
    label: string
    addButtonLabel?: string
    emptyMessage?: string
    className?: string
    itemClassName?: string
    maxItems?: number
    minItems?: number
    renderItem: (
        name: string,
        index: number,
        remove: (index: number) => void,
        isLast: boolean
    ) => React.ReactNode
    renderEmpty?: () => React.ReactNode
    createEmptyItem: () => any
    itemHeader?: (item: any, index: number) => React.ReactNode
}

const FormArrayField: React.FC<FormArrayFieldProps> = ({
    name,
    label,
    addButtonLabel = 'Add Item',
    emptyMessage = 'No items added yet',
    className = '',
    itemClassName = '',
    maxItems,
    minItems = 0,
    renderItem,
    renderEmpty,
    createEmptyItem,
    itemHeader,
}) => {
    const { values } = useFormikContext<any>()
    const items = values[name] || []

    return (
        <div className={cn('space-y-4', className)}>
            <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">{label}</h3>
                {maxItems && (
                    <span className="text-sm text-muted-foreground">
                        {items.length}/{maxItems}
                    </span>
                )}
            </div>

            <FieldArray name={name}>
                {({ push, remove }) => (
                    <div className="space-y-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 border border-dashed rounded-lg">
                                {renderEmpty ? (
                                    renderEmpty()
                                ) : (
                                    <p className="text-muted-foreground text-sm">
                                        {emptyMessage}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item: any, index: number) => (
                                    <Card
                                        key={index}
                                        className={cn(
                                            'overflow-hidden border shadow-sm',
                                            itemClassName
                                        )}
                                    >
                                        {itemHeader && (
                                            <CardHeader className="bg-muted/50 py-3">
                                                {itemHeader(item, index)}
                                            </CardHeader>
                                        )}
                                        <CardContent className="pt-4">
                                            {renderItem(
                                                `${name}[${index}]`,
                                                index,
                                                remove,
                                                index === items.length - 1
                                            )}
                                        </CardContent>
                                        {items.length > minItems && (
                                            <CardFooter className="flex justify-end border-t py-2 bg-muted/30">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Remove
                                                </Button>
                                            </CardFooter>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        )}

                        {(!maxItems || items.length < maxItems) && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => push(createEmptyItem())}
                                className="w-full"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                {addButtonLabel}
                            </Button>
                        )}
                    </div>
                )}
            </FieldArray>
        </div>
    )
}

export default FormArrayField
