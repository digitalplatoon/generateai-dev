import { useState } from 'react';
import { Plus, Trash2, Globe, Star, Search, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { SeoProjectUrl } from '@/types/seo';
import { format } from 'date-fns';

interface UrlManagerProps {
  urls: SeoProjectUrl[];
  isLoading: boolean;
  onAddUrl: (data: { url: string; is_key_url: boolean }) => Promise<void>;
  onDeleteUrl: (id: string) => Promise<void>;
  onDiscoverUrls: () => Promise<void>;
  isAdding: boolean;
  isDeleting: boolean;
  isDiscovering: boolean;
}

export function UrlManager({
  urls,
  isLoading,
  onAddUrl,
  onDeleteUrl,
  onDiscoverUrls,
  isAdding,
  isDeleting,
  isDiscovering,
}: UrlManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [isKeyUrl, setIsKeyUrl] = useState(true);
  const [filter, setFilter] = useState('');

  const filteredUrls = urls.filter(u => 
    u.url.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = async () => {
    await onAddUrl({ url: newUrl, is_key_url: isKeyUrl });
    setNewUrl('');
    setIsKeyUrl(true);
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter URLs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDiscoverUrls} disabled={isDiscovering}>
            {isDiscovering ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Globe className="h-4 w-4 mr-2" />
            )}
            Discover from Sitemap
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add URL
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-32">Source</TableHead>
              <TableHead className="w-40">Last Scanned</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredUrls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {urls.length === 0 ? 'No URLs added yet' : 'No URLs match your filter'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUrls.map((url) => (
                <TableRow key={url.id}>
                  <TableCell>
                    {url.is_key_url && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-md">{url.url}</span>
                      <a 
                        href={url.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {url.discovered_from}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {url.last_scanned_at 
                      ? format(new Date(url.last_scanned_at), 'MMM d, HH:mm')
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteUrl(url.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{urls.length} total URLs</span>
        <span>{urls.filter(u => u.is_key_url).length} key URLs</span>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="key-url"
                checked={isKeyUrl}
                onCheckedChange={(checked) => setIsKeyUrl(checked === true)}
              />
              <Label htmlFor="key-url" className="text-sm">
                Mark as key URL (will always be included in scans)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!newUrl || isAdding}>
              {isAdding ? 'Adding...' : 'Add URL'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
