"use client";

import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { TemplateCard } from "../TemplateCard/TemplateCard";
import { TemplateFilters } from "../TemplateFilters/TemplateFilters";
import { TemplateSearch } from "../TemplateSearch/TemplateSearch";
import { useTemplateController } from "../../hooks/useTemplateController";
import { useTemplateI18n } from "../../i18n/context";

export function TemplateList() {
  const { t } = useTemplateI18n();
  const {
    templates,
    filters,
    handleSearchChange,
    handleUseCaseToggle,
    handleFrameworkToggle,
    handleCSSToggle,
    handleDatabaseToggle,
    handleAuthenticationToggle,
    handleCMSToggle,
    handleExperimentationToggle,
  } = useTemplateController();

  return (
    <div className="TemplateList">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex w-full items-center justify-end">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">{t.description}</p>
          <TemplateSearch
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder={t.searchPlaceholder}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="sticky top-8">
              <TemplateFilters
                selectedUseCases={filters.selectedUseCases}
                selectedFrameworks={filters.selectedFrameworks}
                selectedCSS={filters.selectedCSS}
                selectedDatabases={filters.selectedDatabases}
                selectedAuthentication={filters.selectedAuthentication}
                selectedCMS={filters.selectedCMS}
                selectedExperimentation={filters.selectedExperimentation}
                onUseCaseToggle={handleUseCaseToggle}
                onFrameworkToggle={handleFrameworkToggle}
                onCSSToggle={handleCSSToggle}
                onDatabaseToggle={handleDatabaseToggle}
                onAuthenticationToggle={handleAuthenticationToggle}
                onCMSToggle={handleCMSToggle}
                onExperimentationToggle={handleExperimentationToggle}
              />
            </div>
          </aside>

          {/* Template Grid */}
          <main className="flex-1">
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-lg">{t.noTemplatesFound}</p>
                <p className="text-muted-foreground mt-2 text-sm">{t.tryAdjustingFilters}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

