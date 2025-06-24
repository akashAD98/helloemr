import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot, User, ArrowLeft, Upload, FileText, X, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
}

interface UploadedFile {
  name: string;
  size: number;
  file: File;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export function HealthcareChatbot() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: `session-${Date.now()}`,
    title: "New Chat",
    timestamp: new Date(),
    messages: [{
      id: "welcome",
      content: "Hello ! I'm your AI healthcare assistant. Ask me any health-related questions.", 
      role: "assistant",
      timestamp: new Date()
    }]
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSessions, setShowSessions] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createNewSession = () => {
    // Save current session if it has messages
    if (currentSession.messages.length > 1) {
      setSessions(prev => [currentSession, ...prev]);
    }

    // Create new session
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "New Chat",
      timestamp: new Date(),
      messages: [{
        id: "welcome",
        content: "Hello! I'm your AI healthcare assistant. Upload a medical document or ask me any health-related questions.",
        role: "assistant",
        timestamp: new Date()
      }]
    };
    setCurrentSession(newSession);
    setUploadedFile(null);
    setInput("");
    setShowSessions(false);
  };

  const switchSession = (session: ChatSession) => {
    setCurrentSession(session);
    setShowSessions(false);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile({
      name: file.name,
      size: file.size,
      file: file
    });

    // Start upload process
    setIsLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', 'test_user');
    formData.append('thread_id', currentSession.id);

    try {
      const response = await fetch('http://localhost:8087/nlp/v1/chatbot/pdf/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 12345'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();
      console.log('Upload response:', data);
      
      if (data?.thread_id || data?.message) {
        // Update session title with document name
        setCurrentSession(prev => ({
          ...prev,
          title: `Chat about ${file.name}`,
          messages: [...prev.messages, {
            id: `system-${Date.now()}`,
            content: "PDF uploaded successfully. You can now ask questions about the document.",
            role: "system",
            timestamp: new Date()
          }]
        }));
        
        toast({
          title: "Document uploaded",
          description: "Your medical document has been processed successfully",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to process the document. Please check if the backend service is running.",
        variant: "destructive"
      });
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date()
    };

    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));
    setInput("");
    setIsLoading(true);

    try {
      const requestBody = {
        query: input,
        thread_id: currentSession.id,
        user_id: "test_user",
        conversation_id: currentSession.id
      };

      const response = await fetch('http://localhost:8087/nlp/v1/chatbot/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 12345'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      console.log('Backend response:', data);
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: data.response || data.message || data.answer || "I apologize, but I couldn't generate a response. Please try again.",
        role: "assistant",
        timestamp: new Date()
      };

      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage]
      }));

      // Update session title if it's still "New Chat"
      if (currentSession.title === "New Chat" && input.length > 0) {
        setCurrentSession(prev => ({
          ...prev,
          title: input.slice(0, 40) + (input.length > 40 ? "..." : "")
        }));
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please check if the backend service is running.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sessions Sidebar */}
      <div className={cn(
        "w-80 bg-gray-900 text-white flex-shrink-0 transition-all duration-300 ease-in-out",
        showSessions ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 space-y-4">
          <Button 
            onClick={createNewSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>

          <div className="space-y-2">
            {[currentSession, ...sessions].map((session) => (
              <div
                key={session.id}
                onClick={() => switchSession(session)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors",
                  session.id === currentSession.id ? "bg-gray-800" : ""
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm truncate">{session.title}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {session.timestamp.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Card className="border-b rounded-none shadow-sm bg-white">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSessions(!showSessions)}
                  className="md:hidden hover:bg-gray-100"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/ai-analytics')}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-xl font-semibold">Healthcare AI Assistant</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={createNewSession}
                  className="hover:bg-gray-100"
                  title="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Badge variant="secondary" className="px-3 py-1.5">Medical Chat</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {currentSession.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "py-8",
                  message.role === "assistant" ? "bg-white" : "bg-gray-50"
                )}
              >
                <div className="px-4 sm:px-8 flex gap-4 sm:gap-6 max-w-3xl mx-auto">
                  <div className={cn(
                    "w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0",
                    message.role === "user" 
                      ? "bg-gray-700 text-white" 
                      : message.role === "system"
                      ? "bg-gray-500 text-white"
                      : "bg-emerald-600 text-white"
                  )}>
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : message.role === "system" ? (
                      <MessageSquare className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="min-w-0 space-y-3">
                    {message.role === "assistant" ? (
                      <div className="prose prose-slate max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1 className="text-2xl font-semibold mt-8 first:mt-0 mb-4" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2 className="text-xl font-semibold mt-6 mb-4" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3 className="text-lg font-semibold mt-5 mb-3" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                              <p className="text-gray-700 leading-7 mb-4 last:mb-0" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="my-4 list-disc list-outside pl-8 space-y-2" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol className="my-4 list-decimal list-outside pl-8 space-y-2" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="text-gray-700 leading-7" {...props} />
                            ),
                            code: ({ node, className, children, ...props }: any) => {
                              const match = /language-(\w+)/.exec(className || '');
                              const isInline = !match && !children?.includes('\n');
                              
                              return isInline ? (
                                <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              ) : (
                                <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4">
                                  <code className="text-sm font-mono text-gray-800" {...props}>
                                    {children}
                                  </code>
                                </pre>
                              );
                            },
                            blockquote: ({ node, ...props }) => (
                              <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic text-gray-700" {...props} />
                            ),
                            a: ({ node, ...props }) => (
                              <a className="text-blue-600 hover:underline" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                              <em className="italic" {...props} />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-7">{message.content}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* File Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="p-4 border-t bg-white">
            <div className="max-w-4xl mx-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Uploading document...</span>
                <span className="text-gray-900 font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                accept=".pdf,.doc,.docx"
                ref={fileInputRef}
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 bottom-3 hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="h-5 w-5 text-gray-600" />
              </Button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask medical questions or upload a document to discuss..."
                className="w-full p-4 pl-14 pr-24 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none overflow-hidden"
                rows={1}
              />
              <Button
                className="absolute right-2 bottom-3"
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            {uploadedFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{uploadedFile.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:text-red-500"
                  onClick={removeFile}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
