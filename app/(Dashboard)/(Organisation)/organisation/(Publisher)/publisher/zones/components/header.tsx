
type CampaignSectionHeaderProps = {
    title: string;
    subtitle: string;
};

export default function CampaignSectionHeader({ title, subtitle }: CampaignSectionHeaderProps) {
    return (
        <header className="border-b border-gray-700 pb-4 mb-6">
            <h1 className="text-2xl font-semibold text-white">{title}</h1>
            <p className="text-sm text-gray-400">{subtitle}</p>
        </header>
    );
}
