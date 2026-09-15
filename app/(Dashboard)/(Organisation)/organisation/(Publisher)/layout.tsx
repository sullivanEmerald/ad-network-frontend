import { RoleGuard } from "@/guards/role-guard";

export default function PublisherLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedAccountType="PUBLISHER" redirectTo="/organisation/dashboard">
            {children}
        </RoleGuard>
    );
}