import { notFound } from "next/navigation";
import { VisitorDetails } from "../components/visitor-details";

export default async function VisitorDetailsByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  return <VisitorDetails visitorId={id} />;
}
