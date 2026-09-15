import { RoleGuard } from "@/guards/role-guard";
import { publisherEndpoints } from "@/endpoints/publisher";

export default function AdvertiserLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedAccountType="ADVERTISER" redirectTo={publisherEndpoints.dashboard}>
            {children}
        </RoleGuard>
    );
}