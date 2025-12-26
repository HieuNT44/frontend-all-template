"use client";

import { useMemo, useState } from "react";

import { MOCK_TEMPLATES } from "../constants/template.constants";
import type {
  Authentication,
  CMS,
  CSS,
  Database,
  Experimentation,
  Framework,
  Template,
  TemplateFilters,
  UseCase,
} from "../types/template.types";

function toggleFilter<T>(current: T[], value: T): T[] {
  const isSelected = current.includes(value);
  return isSelected ? current.filter((item) => item !== value) : [...current, value];
}

function matchesFilter<T>(templateValues: T[] | undefined, selectedFilters: T[]): boolean {
  if (selectedFilters.length === 0) return true;
  if (!templateValues || templateValues.length === 0) return false;
  return templateValues.some((value) => selectedFilters.includes(value));
}

export function useTemplateController() {
  const [filters, setFilters] = useState<TemplateFilters>({
    searchQuery: "",
    selectedUseCases: [],
    selectedFrameworks: [],
    selectedCSS: [],
    selectedDatabases: [],
    selectedAuthentication: [],
    selectedCMS: [],
    selectedExperimentation: [],
  });

  const filteredTemplates = useMemo(() => {
    let result = MOCK_TEMPLATES;

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query)
      );
    }

    // Filter by use cases
    if (filters.selectedUseCases.length > 0) {
      result = result.filter((template) =>
        matchesFilter(template.useCases, filters.selectedUseCases)
      );
    }

    // Filter by frameworks
    if (filters.selectedFrameworks.length > 0) {
      result = result.filter((template) =>
        matchesFilter(template.frameworks, filters.selectedFrameworks)
      );
    }

    // Filter by CSS
    if (filters.selectedCSS.length > 0) {
      result = result.filter((template) => matchesFilter(template.css, filters.selectedCSS));
    }

    // Filter by databases
    if (filters.selectedDatabases.length > 0) {
      result = result.filter((template) =>
        matchesFilter(template.databases, filters.selectedDatabases)
      );
    }

    // Filter by authentication
    if (filters.selectedAuthentication.length > 0) {
      result = result.filter((template) =>
        matchesFilter(template.authentication, filters.selectedAuthentication)
      );
    }

    // Filter by CMS
    if (filters.selectedCMS.length > 0) {
      result = result.filter((template) => matchesFilter(template.cms, filters.selectedCMS));
    }

    // Filter by experimentation
    if (filters.selectedExperimentation.length > 0) {
      result = result.filter((template) =>
        matchesFilter(template.experimentation, filters.selectedExperimentation)
      );
    }

    return result;
  }, [filters]);

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleUseCaseToggle = (useCase: UseCase) => {
    setFilters((prev) => ({
      ...prev,
      selectedUseCases: toggleFilter(prev.selectedUseCases, useCase),
    }));
  };

  const handleFrameworkToggle = (framework: Framework) => {
    setFilters((prev) => ({
      ...prev,
      selectedFrameworks: toggleFilter(prev.selectedFrameworks, framework),
    }));
  };

  const handleCSSToggle = (css: CSS) => {
    setFilters((prev) => ({
      ...prev,
      selectedCSS: toggleFilter(prev.selectedCSS, css),
    }));
  };

  const handleDatabaseToggle = (database: Database) => {
    setFilters((prev) => ({
      ...prev,
      selectedDatabases: toggleFilter(prev.selectedDatabases, database),
    }));
  };

  const handleAuthenticationToggle = (auth: Authentication) => {
    setFilters((prev) => ({
      ...prev,
      selectedAuthentication: toggleFilter(prev.selectedAuthentication, auth),
    }));
  };

  const handleCMSToggle = (cms: CMS) => {
    setFilters((prev) => ({
      ...prev,
      selectedCMS: toggleFilter(prev.selectedCMS, cms),
    }));
  };

  const handleExperimentationToggle = (exp: Experimentation) => {
    setFilters((prev) => ({
      ...prev,
      selectedExperimentation: toggleFilter(prev.selectedExperimentation, exp),
    }));
  };

  return {
    templates: filteredTemplates,
    filters,
    handleSearchChange,
    handleUseCaseToggle,
    handleFrameworkToggle,
    handleCSSToggle,
    handleDatabaseToggle,
    handleAuthenticationToggle,
    handleCMSToggle,
    handleExperimentationToggle,
  };
}

