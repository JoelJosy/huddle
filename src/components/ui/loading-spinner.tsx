import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
  <div className="animate-in fade-in flex flex-col items-center justify-center py-10 duration-700">
    <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
    <p className="text-muted-foreground mt-4">{text}</p>
  </div>
);
