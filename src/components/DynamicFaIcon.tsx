// components/DynamicFaIcon.tsx
import * as FaIcons from 'react-icons/fa';

interface Props {
    name: string | null; // ejemplo: 'FaHome', 'FaUser'
    size?: number;
    className?: string;
}

const DynamicFaIcon: React.FC<Props> = ({ name, size = 20, className }) => {
    name = name ?? 'FaX';
    const Icon = FaIcons[name as keyof typeof FaIcons];
    if (!Icon) return null;

    return <Icon size={size} className={`text-gray-400 ${className} `} />;
};

export default DynamicFaIcon;
