// import DashboardMetrics from "@/components/DashboardMetrics";
import UsernameForm from "@/components/UsernameForm";
import { Protect } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Lock } from "lucide-react";

const DashboardPage = async () => {
  const user = await currentUser();

  // const preloadedLinks = await preloadQuery(api.lib.links.getLinksByUserId, {
  //   userId: user!.id,
  // });

  // const analytics = await fetchAnalytics(user!.id);
  return (
    <div>
      {/* Analytics metris - Premium */}
      <Protect
        feature="analytics"
        fallback={
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gray-400 rounded-xl">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Analytics Overview
                    </h2>
                    <p className="text-gray-600">
                      🔒 Upgrade to Pro/Ultra to unlock analytics
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="bg-gray-100 rounded-lg p-4 text-center w-full">
                    <p className="text-gray-500">
                      Get detailed insights into your link performance with our
                      Pro and Ultra plans
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {/* <DashboardMetrics analytics={analytics} /> */}
      </Protect>

      {/* Customize Linktree url form */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
            <UsernameForm />
          </div>
        </div>
      </div>
      {/* Page Customization form */}
    </div>
  );
};
export default DashboardPage;
