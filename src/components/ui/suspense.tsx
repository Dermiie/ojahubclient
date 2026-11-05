import { Loader2 } from 'lucide-react';

export default function Suspense() {
  return (
    <div>
      <div>
        <Loader2 />
        <span>Loading...</span>
      </div>
    </div>
  );
}
