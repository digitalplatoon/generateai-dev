import { Play, Loader2, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SeoScanRun } from '@/types/seo';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ScanRunnerProps {
  projectId: string;
  scans: SeoScanRun[];
  isLoading: boolean;
  onTriggerScan: (urlIds?: string[]) => Promise<void>;
  isTriggering: boolean;
  urlCount: number;
}

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', className: 'bg-muted text-muted-foreground' },
  running: { icon: Loader2, label: 'Running', className: 'bg-blue-500/10 text-blue-600' },
  completed: { icon: CheckCircle2, label: 'Completed', className: 'bg-green-500/10 text-green-600' },
  failed: { icon: XCircle, label: 'Failed', className: 'bg-red-500/10 text-red-600' },
  partial: { icon: AlertCircle, label: 'Partial', className: 'bg-yellow-500/10 text-yellow-600' },
};

export function ScanRunner({ 
  projectId, 
  scans, 
  isLoading, 
  onTriggerScan, 
  isTriggering,
  urlCount 
}: ScanRunnerProps) {
  const navigate = useNavigate();
  const currentScan = scans.find(s => s.status === 'running' || s.status === 'pending');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Run Scan</CardTitle>
        </CardHeader>
        <CardContent>
          {currentScan ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <div>
                  <p className="font-medium">Scan in progress</p>
                  <p className="text-sm text-muted-foreground">
                    {currentScan.urls_scanned} of {urlCount} URLs scanned
                  </p>
                </div>
              </div>
              <Progress value={(currentScan.urls_scanned / Math.max(urlCount, 1)) * 100} />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {urlCount === 0 
                    ? 'Add URLs to your project before running a scan.'
                    : `Ready to scan ${urlCount} URLs (mobile + desktop)`}
                </p>
              </div>
              <Button 
                onClick={() => onTriggerScan()} 
                disabled={isTriggering || urlCount === 0}
              >
                {isTriggering ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Scan
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scan History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>URLs</TableHead>
                <TableHead>Triggered By</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : scans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No scans yet. Run your first scan above.
                  </TableCell>
                </TableRow>
              ) : (
                scans.map((scan) => {
                  const config = statusConfig[scan.status];
                  const Icon = config.icon;
                  
                  return (
                    <TableRow 
                      key={scan.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/seo-audit/${scan.id}`)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(new Date(scan.created_at), 'MMM d, yyyy')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(scan.created_at), 'HH:mm')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={config.className}>
                          <Icon className={`h-3 w-3 mr-1 ${scan.status === 'running' ? 'animate-spin' : ''}`} />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {scan.urls_scanned}
                          {scan.urls_failed > 0 && (
                            <span className="text-red-500"> ({scan.urls_failed} failed)</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {scan.triggered_by}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
