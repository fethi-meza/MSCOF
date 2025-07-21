
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyEnrollmentsCard() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Formations Yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't enrolled in any formations. Browse available formations to get started.
        </p>
        <Button asChild>
          <Link to="/formations">Browse Formations</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
