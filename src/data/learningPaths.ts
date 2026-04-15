export interface LearningPath {
  title: string;
  duration: string;
  modules: number;
  badge: string;
  description?: string;
  difficulty?: string;
  enrolled?: number;
  rating?: number;
  progress?: number;
}

export const roleOptions = ["Beginner", "Full-Stack", "ML Engineer", "DevOps", "Data Scientist"];
export const techStack = ["Python", "JavaScript", "Rust", "Enterprise", "React", "Node.js"];

export const learningPaths: Record<string, Record<string, LearningPath[]>> = {
  "Beginner": {
    "Python": [
      { title: "AI Fundamentals", duration: "2 weeks", modules: 8, badge: "Foundation", description: "Learn the core concepts of artificial intelligence and machine learning", difficulty: "Beginner", enrolled: 1247, rating: 4.8, progress: 0 },
      { title: "Prompt Engineering", duration: "1 week", modules: 5, badge: "Prompting", description: "Master the art of crafting effective prompts for AI models", difficulty: "Beginner", enrolled: 892, rating: 4.9, progress: 0 },
      { title: "Basic RAG Systems", duration: "3 weeks", modules: 12, badge: "RAG Builder", description: "Build your first Retrieval-Augmented Generation system", difficulty: "Intermediate", enrolled: 634, rating: 4.7, progress: 0 }
    ],
    "JavaScript": [
      { title: "Web AI Integration", duration: "2 weeks", modules: 10, badge: "Frontend AI", description: "Integrate AI capabilities into web applications", difficulty: "Beginner", enrolled: 567, rating: 4.6, progress: 0 },
      { title: "Node.js AI APIs", duration: "2.5 weeks", modules: 9, badge: "Backend AI", description: "Create AI-powered backend services with Node.js", difficulty: "Intermediate", enrolled: 432, rating: 4.5, progress: 0 },
      { title: "React AI Components", duration: "1.5 weeks", modules: 7, badge: "Component Master", description: "Build reusable AI components for React", difficulty: "Intermediate", enrolled: 789, rating: 4.8, progress: 0 }
    ]
  },
  "Full-Stack": {
    "Python": [
      { title: "FastAPI + LangChain", duration: "3 weeks", modules: 15, badge: "API Master", description: "Build production-ready AI APIs with FastAPI and LangChain", difficulty: "Advanced", enrolled: 345, rating: 4.9, progress: 0 },
      { title: "Vector Databases", duration: "2 weeks", modules: 8, badge: "Vector Expert", description: "Master vector databases for AI applications", difficulty: "Advanced", enrolled: 278, rating: 4.7, progress: 0 },
      { title: "Production RAG", duration: "4 weeks", modules: 18, badge: "RAG Architect", description: "Deploy scalable RAG systems in production", difficulty: "Expert", enrolled: 198, rating: 4.8, progress: 0 }
    ],
    "JavaScript": [
      { title: "Next.js AI Apps", duration: "3 weeks", modules: 14, badge: "Full-Stack AI", description: "Build full-stack AI applications with Next.js", difficulty: "Advanced", enrolled: 412, rating: 4.6, progress: 0 },
      { title: "Serverless AI", duration: "2 weeks", modules: 9, badge: "Serverless Pro", description: "Deploy AI functions with serverless architecture", difficulty: "Advanced", enrolled: 234, rating: 4.5, progress: 0 },
      { title: "Real-time AI Chat", duration: "2.5 weeks", modules: 11, badge: "Chat Expert", description: "Create real-time AI chat applications", difficulty: "Advanced", enrolled: 356, rating: 4.7, progress: 0 }
    ]
  },
  "ML Engineer": {
    "Python": [
      { title: "Model Fine-tuning", duration: "4 weeks", modules: 20, badge: "Tuning Expert", description: "Fine-tune large language models for specific tasks", difficulty: "Expert", enrolled: 156, rating: 4.9, progress: 0 },
      { title: "Custom Training", duration: "5 weeks", modules: 25, badge: "ML Architect", description: "Train custom AI models from scratch", difficulty: "Expert", enrolled: 89, rating: 4.8, progress: 0 },
      { title: "Model Deployment", duration: "3 weeks", modules: 15, badge: "Deploy Master", description: "Deploy and monitor ML models in production", difficulty: "Expert", enrolled: 134, rating: 4.7, progress: 0 }
    ],
    "Rust": [
      { title: "Rust AI Performance", duration: "4 weeks", modules: 18, badge: "Performance Expert", description: "Build high-performance AI applications with Rust", difficulty: "Expert", enrolled: 67, rating: 4.6, progress: 0 },
      { title: "WASM AI Models", duration: "3 weeks", modules: 12, badge: "WASM Master", description: "Deploy AI models to the browser with WebAssembly", difficulty: "Expert", enrolled: 45, rating: 4.5, progress: 0 },
      { title: "GPU Acceleration", duration: "3.5 weeks", modules: 16, badge: "GPU Specialist", description: "Accelerate AI workloads with GPU computing", difficulty: "Expert", enrolled: 78, rating: 4.8, progress: 0 }
    ]
  }
};
