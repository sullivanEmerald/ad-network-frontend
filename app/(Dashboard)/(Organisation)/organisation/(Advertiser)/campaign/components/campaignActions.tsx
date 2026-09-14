import { CampaignDialogProps } from "./campaignDialog"
import CampaignDialog from "./campaignDialog"
import Button from "@/components/common/button"

export default function CampaignActions({ campaign, budget, buttonOnClick, triggerLabel }: CampaignDialogProps) {
    return (
        <div className="flex w-full items-center justify-between sm:col-span-2 ">
            <Button
                className=""
                onClick={buttonOnClick}
            >
                Add Banners
            </Button>
            <CampaignDialog campaign={campaign} budget={budget} triggerLabel={triggerLabel} />
        </div>
    )
}