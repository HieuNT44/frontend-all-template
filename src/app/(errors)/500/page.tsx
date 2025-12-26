import { GeneralError } from "@/features/errors/GeneralError";

export const dynamic = "force-dynamic";

export default function ServerErrorPage() {
  return <GeneralError />;
}
