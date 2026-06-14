import { cn } from "@/lib/utils"

export function Input({
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm",
                "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
                className
            )}
            {...props}
        />
    )
}

export function Textarea({
    className,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={cn(
                "flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm",
                "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
                className
            )}
            {...props}
        />
    )
}

export function Label({
    className,
    ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={cn("text-sm font-medium text-slate-700 dark:text-slate-300", className)}
            {...props}
        />
    )
}
