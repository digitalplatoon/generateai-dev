import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, GraduationCap, MessageSquare } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { useGlobalSearch, SearchResult } from '@/hooks/useGlobalSearch';

const typeIcons = {
  prompt: FileText,
  'learning-path': GraduationCap,
  conversation: MessageSquare,
};

const typeLabels = {
  prompt: 'Prompt',
  'learning-path': 'Learning Path',
  conversation: 'Conversation',
};

const typeColors = {
  prompt: 'bg-blue-500/10 text-blue-500',
  'learning-path': 'bg-green-500/10 text-green-500',
  conversation: 'bg-purple-500/10 text-purple-500',
};

type FilterType = 'prompt' | 'learning-path' | 'conversation';

interface GlobalSearchProps {
  trigger?: React.ReactNode;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(new Set());
  const { query, setQuery, results } = useGlobalSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    navigate(result.link);
  };

  const toggleFilter = (type: FilterType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const filteredResults = activeFilters.size === 0
    ? results
    : results.filter((result) => activeFilters.has(result.type as FilterType));

  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search prompts, learning paths, conversations..."
          value={query}
          onValueChange={setQuery}
        />
        
        <div className="flex items-center gap-2 px-3 py-2 border-b">
          <span className="text-xs text-muted-foreground">Filter:</span>
          {(Object.keys(typeLabels) as FilterType[]).map((type) => {
            const Icon = typeIcons[type];
            const isActive = activeFilters.has(type);
            return (
              <Toggle
                key={type}
                size="sm"
                pressed={isActive}
                onPressedChange={() => toggleFilter(type)}
                className="h-7 px-2 gap-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{typeLabels[type]}s</span>
              </Toggle>
            );
          })}
        </div>

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {Object.entries(groupedResults).map(([type, items]) => {
            const Icon = typeIcons[type as keyof typeof typeIcons];
            return (
              <CommandGroup key={type} heading={typeLabels[type as keyof typeof typeLabels] + 's'}>
                {items.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={result.title}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className={`p-2 rounded-md ${typeColors[result.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{result.title}</span>
                        {result.category && (
                          <Badge variant="secondary" className="text-xs">
                            {result.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {result.description}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
