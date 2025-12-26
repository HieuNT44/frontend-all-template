"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface TemplateSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TemplateSearch({ value, onChange, placeholder = "Search templates..." }: TemplateSearchProps) {
  return (
    <div className="TemplateSearch relative w-full max-w-2xl">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

