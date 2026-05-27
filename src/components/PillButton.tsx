import { useStage } from '@/contexts/StageContext';

interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'border' | 'filled';
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export default function PillButton({ children, variant = 'border', onClick, type = 'button', className = '' }: PillButtonProps) {
  const { stage } = useStage();
  const isInverted = stage !== 'surface';

  const baseStyles = 'h-[40px] px-6 rounded-pill text-body-small font-medium transition-all duration-300 cursor-pointer inline-flex items-center justify-center';

  if (variant === 'filled') {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${baseStyles} bg-blue text-white hover:opacity-80 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} border transition-all duration-300 ${className}`}
      style={{
        borderColor: isInverted ? 'rgba(255,255,255,0.4)' : '#CECECE',
        color: isInverted ? '#FFFFFF' : '#000000',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isInverted ? '#FFFFFF' : '#0F62FE';
        e.currentTarget.style.color = isInverted ? '#0F62FE' : '#FFFFFF';
        e.currentTarget.style.borderColor = isInverted ? '#FFFFFF' : '#0F62FE';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = isInverted ? '#FFFFFF' : '#000000';
        e.currentTarget.style.borderColor = isInverted ? 'rgba(255,255,255,0.4)' : '#CECECE';
      }}
    >
      {children}
    </button>
  );
}
