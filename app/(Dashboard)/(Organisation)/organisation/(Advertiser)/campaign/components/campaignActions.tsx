import { CampaignDialogProps } from "./campaignDialog"
import CampaignDialog from "./campaignDialog"
import Button from "@/components/common/button"

export default function CampaignActions({ campaign, budget, buttonOnClick }: CampaignDialogProps) {
    return (
        <>
            <Button
                className=""
                onClick={buttonOnClick}
            >
                Add Banners
            </Button>
            {/* <CampaignDialog /> */}
        </>
    )
}