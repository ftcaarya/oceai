import {useState, useRef, useEffect} from 'react'
import HighlightablePkg from "highlightable";
const Highlightable = HighlightablePkg.default ?? HighlightablePkg;

const MODES = [
    {
        id: 'policy',
        label: 'Policy',
        prompt: 'You are an expert ocean policy advisor. Help users understand ocean policies, regulations, and marine law. Be specific and cite relevant frameworks.'
    },
    {
        id: 'research',
        label: 'Research',
        prompt: 'You are an expert ocean researcher. Provide detailed information about marine biology, oceanography, climate impact, and conservation. Be scientific and accurate.'
    },
]
function ListSourceButton({ x, y, onClick }) {
    return (
        <div className="fixed z-50 -translate-x-1/2 -translate-y-full" style={{ left: x, top: y - 8 }}>
            <button
                onMouseDown={e => e.preventDefault()}
                onClick={onClick}
                className="px-3 py-1.5 rounded-lg bg-base-900 border border-accent/30 text-accent text-xs font-medium shadow-lg hover:bg-accent hover:text-base-950 transition-all"
            >
                Show Sources
            </button>
        </div>
    )
}

function MessageBubble({msg, isUser, onHighlight}) {

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-up`}>
            {!isUser && (
                <div
                    className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent/20 to-teal/20 border border-accent/10 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"
                         strokeLinecap="round">
                        <path d="M2 12C2 12 5 4 12 4C19 4 22 12 22 12"/>
                        <path d="M2 12C2 12 5 20 12 20C19 20 22 12 22 12"/>
                    </svg>
                </div>
            )}
            <div
                className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                    isUser
                        ? 'bg-accent/15 border border-accent/20 rounded-2xl rounded-br-md text-base-100'
                        : 'bg-base-850 border border-base-700/50 rounded-2xl rounded-bl-md text-base-200'
                }`}
            >
                <p onMouseUp={() => {
                    if (isUser) return
                    const selection = window.getSelection()
                    if (!selection || selection.isCollapsed) { onHighlight(null); return }
                    const rect = selection.getRangeAt(0).getBoundingClientRect()
                    onHighlight({ x: rect.left + rect.width / 2, y: rect.top })
                }} className="whitespace-pre-wrap">{msg.content}</p>
            </div>
        </div>
    )
}

function TypingIndicator() {
    return (
        <div className="flex justify-start animate-fade-in">
            <div
                className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent/20 to-teal/20 border border-accent/10 flex items-center justify-center mr-3 flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"
                     strokeLinecap="round">
                    <path d="M2 12C2 12 5 4 12 4C19 4 22 12 22 12"/>
                    <path d="M2 12C2 12 5 20 12 20C19 20 22 12 22 12"/>
                </svg>
            </div>
            <div className="bg-base-850 border border-base-700/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce"
                         style={{animationDelay: '0ms'}}/>
                    <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce"
                         style={{animationDelay: '150ms'}}/>
                    <div className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce"
                         style={{animationDelay: '300ms'}}/>
                </div>
            </div>
        </div>
    )
}

export default function ChatBot() {
    const [mode, setMode] = useState('policy')
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [highlight, setHighlight] = useState(null)
    const [showSources, setShowSources] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const abortRef = useRef(null)
    // const sourceString = useRef(null)

    useEffect(() => {
        const onSelectionChange = () => {
            const sel = window.getSelection()
            if (!sel || sel.isCollapsed) setHighlight(null)
        }
        document.addEventListener('selectionchange', onSelectionChange)
        return () => document.removeEventListener('selectionchange', onSelectionChange)
    }, [])

    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    // }, [loading])

    useEffect(() => {
        inputRef.current?.focus()
    }, [mode])

    const handleSend = async () => {
        if (!input.trim() || loading) return

        const userMessage = {role: 'user', content: input}
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        // try {
        //     const result = await callFirstMate(input, 0, 0, null, messages)
        //     if (result.success) {
        //         setMessages(prev => [...prev, {role: 'assistant', content: result.data.response, sources: result.data.conditions}])
        //     } else {
        //         setMessages(prev => [...prev, {role: 'assistant', content: `Something went wrong: ${result.error}`}])
        //     }
        // } catch {
        //     setMessages(prev => [...prev, {
        //         role: 'assistant',
        //         content: 'Connection failed. Make sure the backend is running.'
        //     }])
        // } finally {
        //     setLoading(false)
        // }
        if(mode === 'policy') {
            abortRef.current = new AbortController()
            const res = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                body: JSON.stringify({ model: "oceai:latest", prompt: userMessage.content, stream: true }),
                signal: abortRef.current.signal,
            });

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            setMessages(prev => {return [...prev, {
                role: 'assistant',
                content : ''
            }]});
            setLoading(false)
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(l => l.trim());
                    for (const line of lines) {
                        const json = JSON.parse(line);
                        if (json.response) {
                            setMessages(prev => [...prev.slice(0, prev.length - 1), {
                                role: 'assistant',
                                content: prev[prev.length - 1].content + json.response
                            }]);
                        }
                    }
                }
            } catch {
                // fetch was aborted, do nothing
            }
        }
        else {
            abortRef.current = new AbortController()
            const res = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                body: JSON.stringify({ model: "policy:latest", prompt: userMessage.content, stream: true }),
                signal: abortRef.current.signal,
            });

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            setMessages(prev => {return [...prev, {
                role: 'assistant',
                content : ''
            }]});
            setLoading(false)
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(l => l.trim());
                    for (const line of lines) {
                        const json = JSON.parse(line);
                        if (json.response) {
                            setMessages(prev => [...prev.slice(0, prev.length - 1), {
                                role: 'assistant',
                                content: prev[prev.length - 1].content + json.response
                            }]);
                        }
                    }
                }
            } catch {
                // fetch was aborted, do nothing
            }
        }

    }

    const clearChat = () => {
        abortRef.current?.abort()
        setMessages([])
        // inputRef.current?.focus()
    }

    // const sources = showSources || {}
    // const sourceEntries = [
    //     sources.weather && { label: 'Weather', data: sources.weather },
    //     sources.moon    && { label: 'Moon Phase', data: sources.moon },
    //     sources.tides?.length && { label: 'Tides', data: sources.tides },
    //     sources.species?.length && { label: 'Species', data: sources.species },
    // ].filter(Boolean)

    return (
        <div className="min-h-screen pt-28 pb-8 px-4 sm:px-6">
            {highlight && <ListSourceButton x={highlight.x} y={highlight.y} onClick={() => { setShowSources(highlight.sources || true); setHighlight(null) }} />}

            {/* Sources modal — always in DOM, hidden until showSources is set */}
            <div className={`fixed inset-0 z-[100] flex items-center justify-center ${showSources ? '' : 'hidden'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSources(false)} />
                <div className="relative z-10 w-full max-w-md mx-4 glass rounded-2xl border border-base-700/50 p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-base-50">Sources</h2>
                        <button onClick={() => setShowSources(false)} className="text-base-400 hover:text-base-200 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
                        </button>
                    </div>
                    <p>No source entries are available for this message</p>

                </div>
            </div>
            <div className="max-w-3xl mx-auto flex flex-col" style={{height: 'calc(100vh - 10rem)'}}>
                {/* Header */}
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-base-50 tracking-tight mb-1">Chat</h1>
                        <p className="text-sm text-base-400">
                            Ask about ocean policies, marine science, or conservation.
                        </p>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-base-900 border border-base-800">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => {
                                    abortRef.current?.abort()
                                    setMode(m.id);
                                    setMessages([])
                                }}
                                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                                    mode === m.id
                                        ? 'bg-accent/15 text-accent'
                                        : 'text-base-400 hover:text-base-200'
                                }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col min-h-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {messages.length === 0 && (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center max-w-sm">
                                    <div
                                        className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/10 flex items-center justify-center mx-auto mb-4">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8"
                                             strokeWidth="1.5" strokeLinecap="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                        </svg>
                                    </div>
                                    <p className="text-base-300 text-sm mb-1">
                                        {mode === 'policy' ? 'Ocean Policy Advisor' : 'Marine Research Assistant'}
                                    </p>
                                    <p className="text-base-500 text-xs leading-relaxed">
                                        {mode === 'policy'
                                            ? 'Ask about maritime law, fishing regulations, conservation frameworks, or help drafting policy documents.'
                                            : 'Explore marine biology, oceanography, climate effects on ocean systems, or conservation research.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} msg={msg} isUser={msg.role === 'user'} onHighlight={(pos) => pos ? setHighlight({ ...pos, sources: msg.sources }) : setHighlight(null)}/>
                        ))}

                        {loading && <TypingIndicator/>}
                        <div ref={messagesEndRef}/>
                    </div>

                    {/* Input */}
                    <div className="border-t border-surface-border p-4 bg-base-900/50">
                        <div className="flex gap-2.5 items-end">
                            <div className="flex-1 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    placeholder={mode === 'policy' ? 'Ask about ocean policies...' : 'Ask about marine research...'}
                                    disabled={loading}
                                    className="w-full bg-base-850 border border-base-700/50 rounded-xl px-4 py-2.5 text-sm text-base-100 placeholder-base-500 disabled:opacity-50 transition-all"
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent text-base-950 hover:bg-accent-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                        {messages.length > 0 && (
                            <button
                                onClick={clearChat}
                                className="mt-2 text-[11px] text-base-500 hover:text-base-300 transition-colors font-mono"
                            >
                                Clear conversation
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
