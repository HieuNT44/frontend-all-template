"use client";

import { useMemo } from "react";

import { MOCK_TEMPLATES } from "@/features/templates/constants/template.constants";
import type { Template } from "@/features/templates/types/template.types";

export function useTemplateDetail(id: string) {
  const template = useMemo(() => {
    return MOCK_TEMPLATES.find((t) => t.id === id);
  }, [id]);

  return {
    template,
    isLoading: false,
  };
}

