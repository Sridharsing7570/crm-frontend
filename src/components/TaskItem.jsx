import { CheckCircle } from "lucide-react";

export function TaskItem({ id, title, completed, onToggle }) {
    return (
        <div className="flex items-center space-x-3">
            <button
                type="button"
                onClick={() => onToggle(id)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-0 py-0 h-auto"
            >
                <CheckCircle
                    className={`h-4 w-4 ${completed ? "text-green-500" : "text-gray-400"}`}
                />
            </button>
            <span className={`text-sm ${completed ? "line-through text-gray-500" : ""}`}>
                {title}
            </span>
        </div>
    );
}
