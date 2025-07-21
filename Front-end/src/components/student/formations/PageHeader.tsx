
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function PageHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">My Formations</h1>
        <p className="text-muted-foreground">
          Manage your enrolled formations and track your progress.
        </p>
      </div>
      <Button asChild>
        <Link to="/formations">Browse More Formations</Link>
      </Button>
    </div>
  );
}
