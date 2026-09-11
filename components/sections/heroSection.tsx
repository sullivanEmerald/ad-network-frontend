import React from 'react';
import Image from 'next/image';
import { Users } from "@/components/sections/users";
import Button from '../common/button';
import ProviderImage from "@/public/images/hero-image.png";
import BasicButtons from './basicButtons';

export default function HeroSection() {
    return (
        <section className='w-full flex flex-col md:flex-row items-start px-4 sm:px-8 mb-20 relative'>
            <div className='flex flex-col gap-4 w-full lg:w-1/2'>
                <h1
                    className="text-2xl sm:text-5xl font-bold text-primary"
                    role="heading"
                    aria-level={1}
                >
                    AdCustex: Empowering Businesses with Advanced Advertising Solutions

                </h1>
                <p className="text-muted-foreground text-md">
                    AdCustex is a cutting-edge SaaS advertising platform designed to empower businesses with advanced tools for managing and optimizing their advertising campaigns.
                </p>
                <BasicButtons />
                <div className="flex flex-row items-center gap-6 mt-6">
                    <Users />
                    <p className='text-muted-foreground'>Trusted by <span className='text-white'>15,000+{" "}</span>users worldwide</p>
                </div>
            </div>
            <div className="hidden lg:flex w-full lg:w-1/2">
                <Image
                    src={ProviderImage}
                    alt="Provider Image"
                    priority
                    height={600}
                    width={600}
                    className="object-cover"
                />
            </div>
        </section>
    );
}





