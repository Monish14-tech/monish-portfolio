import { Float } from '@react-three/drei';
import { usePerformance } from '../../context/PerformanceContext';

export default function AnimatedFloat({ children, ...props }) {
  const { enableFloat } = usePerformance();
  if (!enableFloat) return children;
  return <Float {...props}>{children}</Float>;
}
