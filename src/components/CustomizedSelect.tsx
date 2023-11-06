import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { FC, useRef, useState } from 'react';

const HEIGHT_OF_OPINION = 32;
const MARGIN_OF_SELECTOR = 8;

export type Option = {
	value: string;
	title: string;
	render?: JSX.Element | null;
};

type CustomizedSelectProps = {
	options: Option[];
	placeholder?: string;
	onChange?: (value: string) => void;
	defaultValue?: string;
};

const CustomizedSelect: FC<CustomizedSelectProps> = ({
	options,
	placeholder = 'Please select',
	onChange = () => {},
}) => {
	const [value, setValue] = useState<Option | null>(null);
	const [open, setOpen] = useState(false);
	const [up, setUp] = useState(false);
	const selectorRef = useRef<HTMLDivElement>(null);

	const handleOpen = () => {
		setOpen((prev) => !prev);
		if (open || !selectorRef?.current) return;

		const spaceLeft =
			window.innerHeight - selectorRef.current?.getBoundingClientRect().bottom;
		const numberOfOpinion = Object.keys(options).length;
		const isOverflow =
			spaceLeft < numberOfOpinion * HEIGHT_OF_OPINION + MARGIN_OF_SELECTOR;
		setUp(isOverflow);
	};

	const handleOnSelect = (option: Option) => {
		setValue(option);
		setOpen(false);
		onChange(option.value)
	};

	const selectorHeight =
		Object.keys(options).length * HEIGHT_OF_OPINION + MARGIN_OF_SELECTOR;

	const orderedOptions = up ? options.reverse() : options;

	return (
		<div className='relative text-sm text-left'>
			<div
				className='w-[180px] bg-background border rounded-lg'
				ref={selectorRef}
			>
				<div
					onClick={handleOpen}
					className='py-2 px-4 flex justify-between items-center cursor-pointer'
				>
					<div className={cn('pr-4', !value && 'text-muted-foreground')}>
						{value?.title || placeholder}
					</div>
					<ChevronDown className='text-sm w-3 h-3' />
				</div>
			</div>
			{open && (
				<div className='absolute bg-white my-1 w-[180px] border rounded-md z-10'
					style={{ top: up ? `-${selectorHeight}px` : '' }}
				>
					{orderedOptions.map((option) => (
						<div
							key={option.value}
							onClick={() => handleOnSelect(option)}
							className={cn('py-2 px-4 flex justify-between items-center cursor-pointer', value?.value === option.value && 'bg-accent')}
						>
							<div className='pr-4'>{option.title}</div>
							{option.render}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CustomizedSelect;
