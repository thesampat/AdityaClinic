import React from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';

export default function PaginationButtons({ onPreviousClick, onNextClick, isPreviousDisabled, isNextDisabled }) {
    return (
        <div className='flex flex-wrap items-end justify-end mt-4'>
            <div>
                <button
                    onClick={onPreviousClick}
                    className={`bg-transprent inline-flex items-center gap-1 text-primary-400 border-2 border-primary-400 font-bold text-xs mr-2 px-2 py-2 rounded ${isPreviousDisabled ? ' cursor-not-allowed':"" }`}
                    disabled={isPreviousDisabled}
                >
                    <GrFormPrevious size={"20px"} />  Previous
                </button>
            </div>
            <div>
                <button
                    onClick={onNextClick}
                    className={`bg-transprent inline-flex items-center gap-1  text-primary-400 border-2 border-primary-400 font-bold text-xs mr-2 px-2 py-2 rounded ${isNextDisabled ? ' cursor-not-allowed':"" }`}
                    disabled={isNextDisabled}
                >
                    Next <GrFormNext size={"20px"} />
                </button>
            </div>
        </div>
    );
}
