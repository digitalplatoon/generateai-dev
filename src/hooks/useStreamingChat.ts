
import { useState, useRef } from 'react';

export const useStreamingChat = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const startStreaming = (initialContent: string) => {
    setIsStreaming(true);
    setStreamingContent(initialContent);
    const controller = new AbortController();
    setAbortController(controller);
  };

  const updateStreamingContent = (content: string) => {
    setStreamingContent(content);
  };

  const stopStreaming = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsStreaming(false);
    setStreamingContent('');
  };

  return {
    isStreaming,
    streamingContent,
    startStreaming,
    updateStreamingContent,
    stopStreaming
  };
};
