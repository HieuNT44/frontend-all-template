"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { TemplateHeader, useTemplateI18n } from "@/features/templates";
import type { Template } from "@/features/templates/types/template.types";

import { useTemplateDetail } from "../../hooks/useTemplateDetail";

interface TemplateDetailProps {
  id: string;
}

function StackSection({ template }: { template: Template }) {
  const { t } = useTemplateI18n();
  const stackItems: string[] = [];

  if (template.frameworks && template.frameworks.length > 0) {
    stackItems.push(...template.frameworks);
  }
  if (template.css && template.css.length > 0) {
    stackItems.push(...template.css);
  }
  if (template.databases && template.databases.length > 0) {
    stackItems.push(...template.databases);
  }
  if (template.authentication && template.authentication.length > 0) {
    stackItems.push(...template.authentication);
  }
  if (template.cms && template.cms.length > 0) {
    stackItems.push(...template.cms);
  }

  return (
    <div className="space-y-4">
      {template.useCases && template.useCases.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t.useCases}</h3>
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
        </div>
      )}

      {stackItems.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t.stack}</h3>
          <div className="flex flex-wrap gap-2">
            {stackItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {template.githubRepo && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t.githubRepo}</h3>
          <a
            href={`https://github.com/${template.githubRepo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            {template.githubRepo}
          </a>
        </div>
      )}
    </div>
  );
}

export function TemplateDetail({ id }: TemplateDetailProps) {
  const { t, locale } = useTemplateI18n();
  const { template } = useTemplateDetail(id);

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-lg">{t.templateNotFound}</p>
          <Link href="/templates">
            <Button variant="outline" className="mt-4">
              {t.backToTemplates}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="TemplateDetail">
      <TemplateHeader />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <Link
              href="/templates"
              className="text-muted-foreground mb-4 inline-flex items-center gap-2 text-sm hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {t.backToTemplates}
            </Link>
            <h1 className="mb-2 text-4xl font-bold">{template.title}</h1>
            <p className="text-muted-foreground text-lg">
              {template.description}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-2 lg:ml-8">
            {template.demoUrl && (
              <Button variant="outline" asChild>
                <a
                  href={template.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.viewDemo}
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            )}
            <Button asChild>
              <a
                href={
                  template.githubRepo
                    ? `https://github.com/${template.githubRepo}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.deploy}
              </a>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Template Preview */}
            {template.thumbnail && (
              <Card className="mb-8 overflow-hidden border-0 shadow-lg">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Card>
            )}

            {/* Technologies Used */}
            {template.technologies && (
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold">
                  {t.technologiesUsed}
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm leading-relaxed">
                      <code className="text-foreground block whitespace-pre-wrap">
                        {template.technologies[locale] ||
                          template.technologies.en}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardContent className="pt-6">
                  <StackSection template={template} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
