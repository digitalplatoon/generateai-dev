import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, FileText, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScheduledPost {
  id: string;
  title: string;
  category: string;
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published';
  author: string;
}

// Sample scheduled posts data
const scheduledPosts: ScheduledPost[] = [
  {
    id: '1',
    title: 'Advanced RAG Techniques for 2025',
    category: 'Technical',
    scheduledDate: new Date(2025, 11, 20),
    status: 'scheduled',
    author: 'Sarah Chen',
  },
  {
    id: '2',
    title: 'Fine-tuning LLMs: A Practical Guide',
    category: 'Tutorial',
    scheduledDate: new Date(2025, 11, 23),
    status: 'draft',
    author: 'Alex Rivera',
  },
  {
    id: '3',
    title: 'AI Ethics in Production Systems',
    category: 'Ethics',
    scheduledDate: new Date(2025, 11, 27),
    status: 'scheduled',
    author: 'Dr. Maya Patel',
  },
  {
    id: '4',
    title: 'Building Multi-Agent Systems',
    category: 'Technical',
    scheduledDate: new Date(2026, 0, 3),
    status: 'draft',
    author: 'James Wilson',
  },
  {
    id: '5',
    title: 'Community Spotlight: December',
    category: 'Community',
    scheduledDate: new Date(2025, 11, 30),
    status: 'scheduled',
    author: 'Community Team',
  },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-white/5 rounded-lg" />);
    }
    
    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const posts = getPostsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 p-2 rounded-lg cursor-pointer transition-all ${
            isSelected 
              ? 'bg-teal/20 border-2 border-teal' 
              : isToday 
                ? 'bg-white/10 border border-teal/50' 
                : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-teal' : 'text-white'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {posts.slice(0, 2).map(post => (
              <div
                key={post.id}
                className={`text-xs truncate px-1 py-0.5 rounded ${
                  post.status === 'scheduled' 
                    ? 'bg-teal/30 text-teal' 
                    : 'bg-yellow-500/30 text-yellow-400'
                }`}
              >
                {post.title}
              </div>
            ))}
            {posts.length > 2 && (
              <div className="text-xs text-light-gray">+{posts.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const selectedPosts = selectedDate ? getPostsForDate(selectedDate) : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-teal" />;
      default:
        return <FileText className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2 bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal" />
            Content Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white font-medium min-w-[140px] text-center">
              {MONTHS[month]} {year}
            </span>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-xs text-light-gray font-medium py-2">
                {day}
              </div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar - Upcoming & Selected */}
      <div className="space-y-6">
        {/* Selected Date Posts */}
        {selectedDate && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPosts.length > 0 ? (
                <div className="space-y-3">
                  {selectedPosts.map(post => (
                    <div key={post.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-white text-sm font-medium">{post.title}</h4>
                        {getStatusIcon(post.status)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-light-gray">{post.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-light-gray text-sm">No posts scheduled for this date.</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Posts */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Upcoming Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledPosts
                .filter(post => post.scheduledDate >= new Date())
                .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
                .slice(0, 5)
                .map(post => (
                  <div key={post.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                    {getStatusIcon(post.status)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">{post.title}</h4>
                      <p className="text-xs text-light-gray">
                        {post.scheduledDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentCalendar;
