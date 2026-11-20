import { AppLogo } from "../common/logo"

export default function Header() {

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
            <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
                <AppLogo />
            </div>
        </header>
    )

}