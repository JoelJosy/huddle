"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface SearchBarProps {
  defaultValue?: string;
}

export function NotesSearchBar({ defaultValue }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(defaultValue || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = (formData: FormData) => {
    const search = formData.get("search") as string;
    const queryString = createQueryString("search", search);
    router.push(`/notes?${queryString}`);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    const queryString = createQueryString("search", "");
    router.push(`/notes?${queryString}`);
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />

      <form action={handleSearch}>
        <Input
          name="search"
          placeholder="Search notes by title, subject, or tags"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="bg-white pr-10 pl-10"
        />
      </form>

      {searchValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearSearch}
          className="hover:bg-muted absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
