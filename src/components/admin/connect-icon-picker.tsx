import { cn } from "@/lib/utils"
import { CONNECT_ICON_OPTIONS, getConnectIcon } from "@/lib/connect-icons"
import type { ConnectIconName } from "@/types/site-content"

interface ConnectIconPickerProps {
    value: ConnectIconName
    onChange: (icon: ConnectIconName) => void
}

export function ConnectIconPicker({ value, onChange }: ConnectIconPickerProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {CONNECT_ICON_OPTIONS.map((iconName) => {
                const Icon = getConnectIcon(iconName)
                const selected = value === iconName

                return (
                    <button
                        key={iconName}
                        type="button"
                        onClick={() => onChange(iconName)}
                        className={cn(
                            "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                            selected
                                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        )}
                        aria-pressed={selected}
                        aria-label={iconName}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{iconName}</span>
                    </button>
                )
            })}
        </div>
    )
}
