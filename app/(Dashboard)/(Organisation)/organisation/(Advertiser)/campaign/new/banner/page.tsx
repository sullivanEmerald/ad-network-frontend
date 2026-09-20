"use client";

import { useEffect, useState } from "react";
import { type FullCampaignData } from "@/lib/schemas/campaign-schema";
// import { useCampaignDraft } from "@/lib/hooks/useCampaignDraftContext";
// import { Field } from "@/components/ui/Field";
import { Field } from "@/components/ui/field";
import { StepFooter } from "@/components/wizard/StepFooter";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import USFlag from "country-flag-icons/react/3x2/US";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Button from "@/components/common/button";
import { useStore } from "@/store/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/common/input";
import { BannerFormData, bannerFormSchema } from "@/lib/schemas/banner";
import { useSearchParams } from "next/navigation";
import { CreateBannerData } from "@/types/banner";
import { showToaster } from "@/components/common/toast";
import { getImageDimensions } from "@/components/banners/helpers";


countries.registerLocale(enLocale);
const GEO_NAMES = countries.getNames("en", { select: "official" });
const COUNTRY_LIST = Object.entries(GEO_NAMES).map(([code, name]) => ({ value: code, label: name })).sort((a, b) => a.label.localeCompare(b.label));

export default function TargetingStep() {
    const searchParams = useSearchParams();
    const campaignId = searchParams.get("campaignId");
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const launchCampaign = useStore((state) => state.launchCampaign);
    const createCampaignBanner = useStore((state) => state.createBanner)
    const isCreating = useStore((state) => state.campaignState.isCreating)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BannerFormData>({
        resolver: zodResolver(bannerFormSchema),
        defaultValues: { name: "", destinationUrl: "" },
    });

    const values = watch();

    function validate(): boolean {
        const result = bannerFormSchema.safeParse(values);
        alert(JSON.stringify(result, null, 2))
        console.log('validation message', result)
        if (!result.success) {
            showToaster('validation error')
            const fieldErrors: Record<string, string> = {};
            for (const issue of result.error.issues) {
                fieldErrors[issue.path[0] as string] = issue.message;
                showToaster(issue.message, 'error')
            }
            return false;
        }
        return true;
    }


    async function handleCreateBanner(data: Partial<FullCampaignData> | CreateBannerData) {
        if (!campaignId) {
            showToaster("Create a campaign. Banner is associated with a campaign. Move to the first step", "error")
            throw new Error("campaignId is required to create a banner");
        }

        const bannerData = data as CreateBannerData;
        const dimensions = await getImageDimensions(bannerData.image);
        const fullData = {
            ...bannerData,
            width: dimensions.width.toString(),
            height: dimensions.height.toString(),
        }
        await createCampaignBanner(campaignId, fullData);
        return { campaignId };
    }

    return (
        <div>
            <Field label="Banner name" htmlFor="bannerName" error={errors.name?.message}>
                <Input
                    placeholder="Summer launch hero"
                    aria-invalid={Boolean(errors.name)}
                    error={errors.name?.message}
                    {...register("name")}
                />
            </Field>
            <Field label="Destination URL" htmlFor="destinationUrl" error={errors.destinationUrl?.message}>
                <Input
                    type="url"
                    placeholder="https://example.com/landing-page"
                    aria-invalid={Boolean(errors.destinationUrl)}
                    error={errors.destinationUrl?.message}
                    {...register("destinationUrl")}
                />
            </Field>
            <div>
                <label htmlFor="banner-image" className="mb-1 block text-sm font-medium text-white">
                    Banner image
                </label>
                <input
                    id="banner-image"
                    type="file"
                    accept="image/*"
                    aria-invalid={Boolean(errors.image)}
                    className="w-full rounded-lg border border-dashed border-gray-600 bg-black/10 px-3 py-3 text-sm text-gray-300 file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                    onChange={async (event) => {
                        const file = event.target.files?.[0];
                        setValue("image", file as File, { shouldValidate: true });
                        setImageDimensions(null);

                        if (!file) return;

                        try {
                            setImageDimensions(await getImageDimensions(file));
                        } catch {
                            showToaster("Unable to read image dimensions", "error");
                        }
                    }}
                />
                {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
                {imageDimensions && (
                    <p className="mt-2 text-sm text-green-500">
                        Dimensions: {imageDimensions.width} x {imageDimensions.height}px
                    </p>
                )}
            </div>

            {/* <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger>
                    <p aria-expanded={open} className="w-[300px] flex items-center bg-primary text-white py-2 px-3 rounded-full justify-between">
                        <span className="flex items-center gap-2">{values.geo.length > 0 ? "Select Multiple Locations" : "Select target country..."}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </p>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Search country or code..." />
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {COUNTRY_LIST.map((country) => (
                                <CommandItem
                                    key={country.value}
                                    value={country.label}
                                    onSelect={() => {
                                        const isSelected = values.geo.some((geo) => geo.code === country.value);
                                        const nextGeo = isSelected
                                            ? values.geo.filter((geo) => geo.code !== country.value)
                                            : [...values.geo, { code: country.value, label: country.label }];
                                        setValue("geo", nextGeo, { shouldValidate: true });
                                    }}
                                >
                                    <Check className={values?.geo?.some((g) => g.code === country.value) ? "mr-2 h-4 w-4 opacity-100" : "mr-2 h-4 w-4 opacity-0"} />
                                    {country.label} ({country.value})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <Field htmlFor="geo" error={errors.geo?.message}>
                <GeoSelection selected={values.geo} onRemove={OnREmoveGeo} />
            </Field>

            <Field label="Choose Devices" htmlFor="devices" error={errors.devices?.message} hint="Select which device types this campaign can run on">
                <DeviceSelection
                    options={DEVICE_OPTIONS}
                    selected={values.devices}
                    onRemove={OnRemoveDevice}
                    onToggle={onToggleDevice}
                />
            </Field> */}

            {/* <Field label="Placements" htmlFor="placements" error={errow4  ch zones this campaign can run in">
                <CheckboxGroup
                    options={PLACEMENT_OPTIONS}
                    selected={placements}
                    onToggle={(v) => toggle(placements, setPlacements, v)}
                />
            </Field> */}

            <StepFooter
                currentStepId={1}
                data={values}
                onCreate={handleCreateBanner}
                // onSaveStep={(stepData) => createDraft({ ...stepData, reviveCampaignId }, draftId, "draft")}
                onNext={validate}
            />
        </div >
    );
}

// interface GeoSelectionProps {
//     selected: TargetingData["geo"];
//     onRemove: (option: TargetingData["geo"][number]) => void;
// }

// function GeoSelection({ selected, onRemove }: GeoSelectionProps) {
//     return (
//         <div className="mt-4 flex flex-wrap gap-2">
//             {selected.map((location) => (
//                 <Button
//                     key={location.code}
//                     type="button"
//                     variant="outline"
//                     onClick={() => onRemove(location)}
//                     className="border-primary/80 bg-transparent"
//                 >
//                     {location.label}
//                 </Button>
//             ))}
//         </div>
//     );
// }



// function DeviceSelection({
//     options,
//     selected,
//     onRemove,
//     onToggle,
// }: DeviceSelectionProps) {
//     return (
//         <div className="mt-2 flex flex-wrap gap-2">
//             {options.map((option) => {
//                 const isSelected = selected.includes(option.value);

//                 return (
//                     <Button
//                         key={option.value}
//                         type="button"
//                         variant="outline"
//                         aria-pressed={isSelected}
//                         onClick={() => onToggle(option.value)}
//                         className={isSelected
//                             ? "border-primary/80 bg-primary/80"
//                             : "bg-transparent border-ink-100 hover:border-ink-300"}
//                     >
//                         {option.label} <span className="ml-1 text-xs">×</span>
//                     </Button>
//                 );
//             })}
//         </div>
//     );
// }   
