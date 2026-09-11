"use client";
import Button from '../common/button';
import { useRouter } from 'next/navigation';

export default function BasicButtons() {
    const router = useRouter();
    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button onClick={() => router.push('/auth/login')} className="">
                Get Started
            </Button>
            <Button onClick={() => { }} className="">
                Learn More
            </Button>
        </div>
    )
}