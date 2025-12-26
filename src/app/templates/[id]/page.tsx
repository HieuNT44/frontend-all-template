import { TemplateI18nProvider } from "@/features/templates";
import { TemplateDetail } from "@/features/templates-detail";

interface TemplateDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { id } = await params;
  return (
    <TemplateI18nProvider>
      <TemplateDetail id={id} />
    </TemplateI18nProvider>
  );
}

