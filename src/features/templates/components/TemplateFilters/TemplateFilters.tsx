"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  AUTHENTICATION_OPTIONS,
  CMS_OPTIONS,
  CSS_OPTIONS,
  DATABASES,
  EXPERIMENTATION_OPTIONS,
  FRAMEWORKS,
  USE_CASES,
} from "../../constants/template.constants";
import { useTemplateI18n } from "../../i18n/context";
import type {
  Authentication,
  CMS,
  CSS,
  Database,
  Experimentation,
  Framework,
  UseCase,
} from "../../types/template.types";

interface TemplateFiltersProps {
  selectedUseCases: UseCase[];
  selectedFrameworks: Framework[];
  selectedCSS: CSS[];
  selectedDatabases: Database[];
  selectedAuthentication: Authentication[];
  selectedCMS: CMS[];
  selectedExperimentation: Experimentation[];
  onUseCaseToggle: (useCase: UseCase) => void;
  onFrameworkToggle: (framework: Framework) => void;
  onCSSToggle: (css: CSS) => void;
  onDatabaseToggle: (database: Database) => void;
  onAuthenticationToggle: (auth: Authentication) => void;
  onCMSToggle: (cms: CMS) => void;
  onExperimentationToggle: (exp: Experimentation) => void;
}

interface FilterSectionProps<T extends string> {
  title: string;
  value: string;
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
  idPrefix: string;
}

function FilterSection<T extends string>({
  title,
  value,
  options,
  selected,
  onToggle,
  idPrefix,
}: FilterSectionProps<T>) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="py-2">
        <span className="font-medium">{title}</span>
      </AccordionTrigger>
      <AccordionContent className="pt-2">
        <div className="space-y-0">
          {options.map((option) => {
            const isChecked = selected.includes(option);
            return (
              <div
                key={option}
                className="flex items-center space-x-2 py-2 first:pt-0 last:pb-0"
              >
                <Checkbox
                  id={`${idPrefix}-${option}`}
                  checked={isChecked}
                  onCheckedChange={() => onToggle(option)}
                  className="shrink-0"
                />
                <Label
                  htmlFor={`${idPrefix}-${option}`}
                  className="cursor-pointer text-sm font-normal leading-none"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function TemplateFilters({
  selectedUseCases,
  selectedFrameworks,
  selectedCSS,
  selectedDatabases,
  selectedAuthentication,
  selectedCMS,
  selectedExperimentation,
  onUseCaseToggle,
  onFrameworkToggle,
  onCSSToggle,
  onDatabaseToggle,
  onAuthenticationToggle,
  onCMSToggle,
  onExperimentationToggle,
}: TemplateFiltersProps) {
  const { t } = useTemplateI18n();

  return (
    <div className="TemplateFilters w-full">
      <h2 className="mb-4 text-lg font-semibold">{t.filterTemplates}</h2>
      <Accordion type="multiple" className="w-full" defaultValue={["use-case"]}>
        <FilterSection
          title={t.useCase}
          value="use-case"
          options={USE_CASES}
          selected={selectedUseCases}
          onToggle={onUseCaseToggle}
          idPrefix="use-case"
        />
        <FilterSection
          title={t.framework}
          value="framework"
          options={FRAMEWORKS}
          selected={selectedFrameworks}
          onToggle={onFrameworkToggle}
          idPrefix="framework"
        />
        <FilterSection
          title={t.css}
          value="css"
          options={CSS_OPTIONS}
          selected={selectedCSS}
          onToggle={onCSSToggle}
          idPrefix="css"
        />
        <FilterSection
          title={t.database}
          value="database"
          options={DATABASES}
          selected={selectedDatabases}
          onToggle={onDatabaseToggle}
          idPrefix="database"
        />
        <FilterSection
          title={t.authentication}
          value="authentication"
          options={AUTHENTICATION_OPTIONS}
          selected={selectedAuthentication}
          onToggle={onAuthenticationToggle}
          idPrefix="authentication"
        />
        <FilterSection
          title={t.cms}
          value="cms"
          options={CMS_OPTIONS}
          selected={selectedCMS}
          onToggle={onCMSToggle}
          idPrefix="cms"
        />
        <FilterSection
          title={t.experimentation}
          value="experimentation"
          options={EXPERIMENTATION_OPTIONS}
          selected={selectedExperimentation}
          onToggle={onExperimentationToggle}
          idPrefix="experimentation"
        />
      </Accordion>
    </div>
  );
}

