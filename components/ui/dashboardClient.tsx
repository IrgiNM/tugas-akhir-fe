"use client";

import Header from "@/components/layout/header";
import Navbar from "@/components/layout/navbar";
import BackupPage from "@/components/ui/backupPage";
import DatasetPage from "@/components/ui/datasetPage";
import DataUser from "@/components/ui/dataUser";
import GetLogPage from "@/components/ui/getLogPage";
import SecurityEventsPage from "@/components/ui/securityEventsPage";
import { getMe, getPermission } from "@/lib/function/api";
import { getToken, setIdUserToken, setUsernameToken } from "@/lib/function/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DashboardClient = () => {
  const router = useRouter();

  const [isActive, setIsActive] = useState("Top Reports");
  const [permissionsNow, setPermissionsNow] = useState<string[]>([]);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getMe();

        if (res.status === 200) {
          setUsernameToken(res.data.username);
          setIdUserToken(res.data.id);

          const permissionRes = await getPermission(Number(res.data.id));

          if (permissionRes.status === 200) {
            const permissions: string[] = permissionRes.data.map(
              (item: { name: string }) => item.name
            );

            setPermissionsNow(permissions);

            if (typeof window !== "undefined") {
              localStorage.setItem("permission", JSON.stringify(permissions));
            }
          }
        }
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="w-full relative h-full flex flex-col gap-3 items-center bg-[#070616]">
      <Header />

      <Navbar
        click1={() => setIsActive("Top Reports")}
        click4={() => setIsActive("Dataset")}
        click3={() => setIsActive("Backup")}
        click2={() => setIsActive("Security Events")}
        isActived={isActive}
      />

      <div className="h-[80%] w-full">
        {isActive === "Top Reports" &&
          permissionsNow.includes("top reports") && <GetLogPage />}

        {isActive === "Backup" &&
          permissionsNow.includes("backup database") && <BackupPage />}

        {isActive === "Security Events" &&
          permissionsNow.includes("security event") && <SecurityEventsPage />}

        {isActive === "Dataset" &&
          permissionsNow.includes("dataset") && <DatasetPage />}

        {isActive === "Data User" && <DataUser />}
      </div>
    </div>
  );
};

export default DashboardClient;