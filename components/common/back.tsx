import { HiArrowLongLeft } from 'react-icons/hi2';
function Back() {
    return (
        <button onClick={() => history.back()} className='flex items-center gap-2 cursor-pointer mb-2'>
            <HiArrowLongLeft className="w-8 h-8 text-gray-700" />
            <span className='text-muted-foreground'>Back</span>
        </button>
    )
}

export { Back }