"use client";

import { useEffect, useState } from "react";
import { targetingSchema, type TargetingData } from "@/lib/schemas/campaign-schema";
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

countries.registerLocale(enLocale);
const GEO_NAMES = countries.getNames("en", { select: "official" });
const COUNTRY_LIST = Object.entries(GEO_NAMES).map(([code, name]) => ({ value: code, label: name })).sort((a, b) => a.label.localeCompare(b.label));

type Device = TargetingData["devices"][number];

const DEVICE_OPTIONS: { value: Device; label: string }[] = [
    { value: "desktop", label: "Desktop" },
    { value: "mobile", label: "Mobile" },
    { value: "tablet", label: "Tablet" },
    { value: "ctv", label: "Connected TV" },
]


export default function TargetingStep() {

    const [open, setOpen] = useState(false);
    const updateDraft = useStore((state) => state.updateCampaignDraft);
    const draft = useStore((state) => state.campaignDraft);

    const {
        register,
        watch,
        trigger,
        setValue,
        reset,
        formState: { errors },
    } = useForm<TargetingData>({
        resolver: zodResolver(targetingSchema),
        defaultValues: {
            geo: draft?.geo || [],
            devices: draft?.devices || [],
        },
        mode: "onBlur",
    });

    const values = watch();

    useEffect(() => {
        if (draft) {
            reset({
                geo: draft.geo || [],
                devices: draft.devices || [],
            });
        }
    }, [draft, reset]);

    useEffect(() => {
        updateDraft(values);
    }, [values.geo, values.devices]);

    function validate(): boolean {
        const result = targetingSchema.safeParse(values);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            for (const issue of result.error.issues) {
                fieldErrors[issue.path[0] as string] = issue.message;
            }
            return false;
        }
        return true;
    }

    const OnREmoveGeo = (value: { code: string; label: string }) => {
        const newGeo = values?.geo.filter((val) => val.code !== value.code) || [];
        setValue("geo", newGeo, { shouldValidate: true });
    }

    const OnRemoveDevice = (value: string) => {
        const newDevices = values?.devices.filter((val) => val !== value) || [];
        setValue("devices", newDevices, { shouldValidate: true });
    }

    const onToggleDevice = (value: Device) => {
        const newDevices = values?.devices.includes(value)
            ? values?.devices.filter((val) => val !== value)
            : [...values?.devices, value];
        setValue("devices", newDevices, { shouldValidate: true });
    }

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
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
            </Field>

            {/* <Field label="Placements" htmlFor="placements" error={errors.placements} hint="Which zones this campaign can run in">
                <CheckboxGroup
                    options={PLACEMENT_OPTIONS}
                    selected={placements}
                    onToggle={(v) => toggle(placements, setPlacements, v)}
                />
            </Field> */}

            <StepFooter currentStepId={1} onNext={validate} />
        </div >
    );
}

interface GeoSelectionProps {
    selected: TargetingData["geo"];
    onRemove: (option: TargetingData["geo"][number]) => void;
}

function GeoSelection({ selected, onRemove }: GeoSelectionProps) {
    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {selected.map((location) => (
                <Button
                    key={location.code}
                    type="button"
                    variant="outline"
                    onClick={() => onRemove(location)}
                    className="border-primary/80 bg-transparent"
                >
                    {location.label}
                </Button>
            ))}
        </div>
    );
}

interface DeviceSelectionProps {
    options: { value: Device; label: string }[];
    selected: Device[];
    onRemove: (option: Device) => void;
    onToggle: (option: Device) => void;
}

function DeviceSelection({
    options,
    selected,
    onRemove,
    onToggle,
}: DeviceSelectionProps) {
    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {options.map((option) => {
                const isSelected = selected.includes(option.value);

                return (
                    <Button
                        key={option.value}
                        type="button"
                        variant="outline"
                        aria-pressed={isSelected}
                        onClick={() => onToggle(option.value)}
                        className={isSelected
                            ? "border-primary/80 bg-primary/80"
                            : "bg-transparent border-ink-100 hover:border-ink-300"}
                    >
                        {option.label} <span className="ml-1 text-xs">×</span>
                    </Button>
                );
            })}
        </div>
    );
}   
