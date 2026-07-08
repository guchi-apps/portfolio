"use client"

import { ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function CollapsibleSection({
    title,
    defaultOpen = false,
    children,
}: {
    title: string
    defaultOpen?: boolean
    children: React.ReactNode
}) {
    return (
        <Card className="py-6">
            <Collapsible defaultOpen={defaultOpen}>
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className="group flex w-full items-center justify-between gap-2 px-6 text-left"
                    >
                        <span className="leading-none font-semibold">{title}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="px-6 pt-6">{children}</div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}
