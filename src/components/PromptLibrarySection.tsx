import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronUp, ChevronDown, Code, BookOpen } from "lucide-react";

const PromptLibrarySection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Debugging", "SQL Generation", "API Docs", "Code Review", "Testing"];
  
  const prompts = [
    {
      title: "Python Error Debugger",
      description: "Analyze Python tracebacks and suggest fixes with explanations",
      category: "Debugging",
      votes: 147,
      tags: ["python", "debugging", "error-handling"],
      author: "alex_dev",
      prompt: `Analyze this Python traceback: {error}. 
      
Provide:
1. Root cause analysis
2. 3 potential fixes with explanations
3. Best practices to prevent similar issues

Format as markdown with code examples.`,
      sampleOutput: `## Error Analysis
**Root Cause**: IndexError in list access

## Potential Fixes:
1. **Bounds Checking**: Add length validation
2. **Try-Catch**: Handle exceptions gracefully  
3. **Defensive Programming**: Use .get() method

## Prevention:
- Always validate array bounds
- Use defensive programming patterns`
    },
    {
      title: "SQL Query Generator",
      description: "Convert natural language to optimized SQL queries",
      category: "SQL Generation",
      votes: 203,
      tags: ["sql", "database", "query-optimization"],
      author: "db_master",
      prompt: `Convert this natural language request to SQL: {request}

Requirements:
- Use proper indexing hints
- Include performance considerations
- Add comments explaining complex joins
- Suggest alternative approaches if applicable`,
      sampleOutput: `-- Find top 10 customers by revenue in 2023
-- Using index on order_date for performance
SELECT 
  c.customer_name,
  SUM(o.total_amount) as total_revenue
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.order_date >= '2023-01-01'
  AND o.order_date < '2024-01-01'
GROUP BY c.id, c.customer_name
ORDER BY total_revenue DESC
LIMIT 10;`
    },
    {
      title: "API Documentation Generator",
      description: "Generate comprehensive API docs from code endpoints",
      category: "API Docs",
      votes: 89,
      tags: ["api", "documentation", "swagger"],
      author: "api_guru",
      prompt: `Generate OpenAPI 3.0 documentation for this endpoint: {code}

Include:
- Detailed parameter descriptions
- Request/response examples
- Error codes and messages
- Authentication requirements
- Rate limiting info`,
      sampleOutput: `## POST /api/users
Creates a new user account

**Parameters:**
- email (string, required): Valid email address
- password (string, required): Minimum 8 characters

**Response:**
\`\`\`json
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2023-12-01T10:00:00Z"
}
\`\`\``
    }
  ];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-navy/50" id="prompt-library">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Community <span className="text-gradient">Prompt Library</span>
          </h2>
          <p className="text-xl text-light-gray max-w-2xl mx-auto">
            Discover, share, and deploy battle-tested prompts with one-click integration
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-gray w-5 h-5" />
            <Input
              placeholder="Search prompts, tags, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-navy/50 border-white/20 text-white placeholder:text-light-gray"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-teal text-navy hover:bg-teal/80" 
                  : "border-white/20 text-white hover:bg-white/10"
                }
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Prompt Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {filteredPrompts.map((prompt, index) => (
            <Card key={index} className="glass border-white/20 hover-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-xl font-display text-white mb-2">
                      {prompt.title}
                    </CardTitle>
                    <CardDescription className="text-light-gray">
                      {prompt.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-teal hover:bg-teal/20">
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-semibold text-white">{prompt.votes}</span>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:bg-white/10">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {prompt.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="bg-teal/20 text-teal border-teal/30 text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-light-gray">
                  by <span className="text-teal">{prompt.author}</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Prompt Preview */}
                <div className="bg-navy/50 rounded-lg p-4 mb-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="w-4 h-4 text-teal" />
                    <span className="text-sm font-semibold text-teal">Prompt Template</span>
                  </div>
                  <pre className="text-sm text-light-gray whitespace-pre-wrap font-mono overflow-x-auto">
                    {prompt.prompt.substring(0, 120)}...
                  </pre>
                </div>

                {/* Sample Output */}
                <div className="bg-navy/30 rounded-lg p-4 mb-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400">Sample Output</span>
                  </div>
                  <div className="text-sm text-light-gray">
                    <div dangerouslySetInnerHTML={{ 
                      __html: prompt.sampleOutput.substring(0, 150).replace(/\n/g, '<br>') 
                    }} />...
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
                    Deploy to Lovable
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Copy Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Stats */}
        <div className="glass rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-display font-bold mb-6">
            Join the AI Builder Community
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-teal mb-2">2,400+</div>
              <div className="text-light-gray">Community Prompts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal mb-2">15,600+</div>
              <div className="text-light-gray">Successful Deployments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal mb-2">890+</div>
              <div className="text-light-gray">Active Contributors</div>
            </div>
          </div>
          <Button className="mt-6 bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy font-semibold">
            Submit Your Prompt
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PromptLibrarySection;
