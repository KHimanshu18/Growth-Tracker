import { notFound } from "next/navigation";
import { VisitorDetails } from "../components/visitor-details";

export default async function VisitorDetailsByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id; // ✅ UUID string

  if (!id || typeof id !== "string") {
    notFound();
  }

  return <VisitorDetails visitorId={id} />;
}
