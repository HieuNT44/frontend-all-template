import { TemplateI18nProvider, TemplateList } from "@/features/templates";

export default function TemplatesPage() {
  return (
    <TemplateI18nProvider>
      <TemplateList />
    </TemplateI18nProvider>
  );
}


