import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { VisitorDetails } from "./components/visitor-details";

export default async function PersonalDetailsPage() {
  const user = await getCurrentUser();

  if (user?.role === "ADMIN") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
          <CardDescription>
            Select a visitor from “View all visitor”.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This tab is for the logged-in visitor’s profile.
        </CardContent>
      </Card>
    );
  }

  return <VisitorDetails />;
}
