import { notFound } from "next/navigation";
import { VisitorDetails } from "../components/visitor-details";

export default async function VisitorDetailsByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    notFound();
  }

  return <VisitorDetails visitorId={id} />;
}
