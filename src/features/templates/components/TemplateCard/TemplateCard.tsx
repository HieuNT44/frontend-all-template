"use client";

import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { Template } from "../../types/template.types";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/templates/${template.id}`} className="h-full">
      <Card className="TemplateCard flex h-full flex-col hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
        {template.thumbnail && (
          <div className="aspect-video w-full shrink-0 overflow-hidden bg-muted">
            <img
              src={template.thumbnail}
              alt={template.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader className="flex-1">
          <CardTitle className="line-clamp-2">{template.title}</CardTitle>
          <CardDescription className="line-clamp-2">{template.description}</CardDescription>
        </CardHeader>
        {template.useCases && template.useCases.length > 0 && (
          <CardContent className="mt-auto">
            <div className="flex flex-wrap gap-2">
              {template.useCases.map((useCase) => (
                <span
                  key={useCase}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}

