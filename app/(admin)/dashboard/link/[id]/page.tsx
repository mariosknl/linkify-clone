import LinkAnalytics from "@/components/LinkAnalytics";
import { fetchLinkAnalytics } from "@/lib/link-analytics-server";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface LinkAnalyticsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function LinkAnalyticsPage({ params }: LinkAnalyticsPageProps) {
  const user = await currentUser();
  const { id } = await params;

  if (!user) {
    notFound();
  }

  // Fetch analytics for the specific link
  const analytics = await fetchLinkAnalytics(user.id, id);

  // If no analytics data found, show the component with empty state
  // The LinkAnalytics component handles the "no data" case gracefully
  if (!analytics) {
    // Return empty analytics object so component can show "no data" state
    const emptyAnalytics = {
      linkId: id,
      linkTitle: "This Link has no analytics",
      linkUrl: "Please wait for analytics to be generated or check back later",
      totalClicks: 0,
      uniqueUsers: 0,
      countriesReached: 0,
      dailyData: [],
      countryData: [],
    };
    return <LinkAnalytics analytics={emptyAnalytics} />;
  }

  return <LinkAnalytics analytics={analytics} />;
}

export default LinkAnalyticsPage;
