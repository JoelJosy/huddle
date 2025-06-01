"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface GroupsSearchBarProps {
  defaultValue?: string;
}

export function GroupsSearchBar({ defaultValue = "" }: GroupsSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value && value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.push(`/groups?${params.toString()}`);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder="Search groups by name, subject, or description..."
        value={query}
        onChange={handleInputChange}
        className="pl-10"
        disabled={isPending}
      />
    </form>
  );
}
