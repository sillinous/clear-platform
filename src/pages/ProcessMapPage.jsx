import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Search, ArrowRight, Building2, ShoppingCart, Home, Car, Briefcase,
  Clock, DollarSign, AlertTriangle, CheckCircle, Circle, X,
  FileText, ExternalLink, ChevronDown, ChevronUp, Filter, Grid, List,
  MapPin, Lightbulb, GitBranch, CheckSquare, RotateCcw,
  Bookmark, Share2, Printer, TrendingUp, PlayCircle, HelpCircle, Flag
} from 'lucide-react';
import { getAllProcesses, getProcessById } from '../data/processes';
import useProcessStore from '../store/useProcessStore';

// Custom node component for ReactFlow
const ProcessNode = React.memo(({ data, selected }) => {
  const { label, nodeType, isCompleted, onSelect, painPoint } = data;
  
  const getNodeStyles = () => {
    const baseStyles = 'px-4 py-3 min-w-[180px] max-w-[220px] cursor-pointer rounded-lg border-2 transition-all duration-200 shadow-lg';
    
    let typeStyles = '';
    switch(nodeType) {
      case 'start':
        typeStyles = 'bg-green-500/20 border-green-500 text-green-100';
        break;
      case 'end':
        typeStyles = 'bg-emerald-500/20 border-emerald-500 text-emerald-100';
        break;
      case 'decision':
        typeStyles = 'bg-amber-500/20 border-amber-500 text-amber-100';
        break;
      case 'wait':
        typeStyles = 'bg-purple-500/20 border-purple-500 text-purple-100';
        break;
      case 'document':
        typeStyles = 'bg-cyan-500/20 border-cyan-500 text-cyan-100';
        break;
      default:
        typeStyles = 'bg-blue-500/20 border-blue-500 text-blue-100';
    }
    
    const stateStyles = isCompleted ? 'opacity-70' : '';
    const painStyles = painPoint ? 'ring-2 ring-red-500 ring-opacity-50' : '';
    const selectedStyles = selected ? 'ring-4 ring-white ring-opacity-30' : '';
    
    return `${baseStyles} ${typeStyles} ${stateStyles} ${painStyles} ${selectedStyles}`;
  };
  
  const getIcon = () => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-green-400" />;
    switch(nodeType) {
      case 'start': return <PlayCircle className="w-5 h-5" />;
      case 'end': return <Flag className="w-5 h-5" />;
      case 'decision': return <HelpCircle className="w-5 h-5" />;
      case 'wait': return <Clock className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return null;
    }
  };
  
  return (
    <div className={getNodeStyles()} onClick={onSelect}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{getIcon()}</div>
        <div className="min-w-0">
          <div className="font-medium text-sm leading-tight">{label}</div>
          {data.timeEstimate && (
            <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {data.timeEstimate}
            </div>
          )}
        </div>
        {data.painPoint && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
      </div>
      {isCompleted && (
        <div className="absolute top-1 right-1">
          <CheckCircle className="w-4 h-4 text-green-400" />
        </div>
      )}
    </div>
  );
});

const nodeTypes = { start: ProcessNode, action: ProcessNode, decision: ProcessNode, wait: ProcessNode, document: ProcessNode, end: ProcessNode };

const iconMap = {
  Building2: Building2,
  ShoppingCart: ShoppingCart,
  Home: Home,
  Car: Car,
  Briefcase: Briefcase
};

// Main ProcessMap Page
const ProcessMapPage = () => {
  const { processId } = useParams();
  
  if (processId) {
    return <ProcessViewer processId={processId} />;
  }
  
  return <ProcessBrowser />;
};

// Process Browser Component
const ProcessBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
  const processes = getAllProcesses();
  const { progress, getCompletionPercentage } = useProcessStore();
  
  const filteredProcesses = processes.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Map className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">ProcessMap</h1>
              <p className="text-slate-400">Navigate government with clarity</p>
            </div>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl">
            Interactive step-by-step guides that turn confusing bureaucratic procedures 
            into clear visual journeys with timelines, costs, and insider tips.
          </p>
        </div>
      </section>
      
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search processes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              <option value="all">All Categories</option>
              <option value="business">Business</option>
              <option value="benefits">Benefits</option>
              <option value="housing">Housing</option>
              <option value="legal">Legal</option>
            </select>
          </div>
        </div>
        
        {/* Process Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcesses.map(process => {
            const IconComponent = iconMap[process.icon] || Map;
            const processProgress = progress[process.id];
            const completion = processProgress 
              ? getCompletionPercentage(process.id, process.nodes.length) 
              : 0;
            
            return (
              <Link
                key={process.id}
                to={`/tools/processmap/${process.id}`}
                className="group block bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all hover:-translate-y-1"
              >
                {processProgress && (
                  <div className="h-1 bg-slate-700">
                    <div className="h-full bg-blue-500" style={{ width: `${completion}%` }} />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      {processProgress && (
                        <span className="text-xs px-2 py-1 bg-blue-500/20 rounded-full text-blue-400">
                          {completion}%
                        </span>
                      )}
                      <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-300">
                        {process.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400">
                    {process.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{process.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {process.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> {process.estimatedCost}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">Complexity</span>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          process.complexityScore < 5 ? 'bg-green-500' :
                          process.complexityScore < 7 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${process.complexityScore * 10}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400">{process.complexityScore}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Process Viewer Component
const ProcessViewer = ({ processId }) => {
  const navigate = useNavigate();
  const process = getProcessById(processId);
  const [selectedStep, setSelectedStep] = useState(null);
  const [viewMode, setViewMode] = useState('flowchart');
  
  const { 
    progress, completeStep, uncompleteStep, isStepCompleted,
    startProcess, resetProcess, getCompletionPercentage
  } = useProcessStore();
  
  useEffect(() => {
    if (process && !progress[processId]) {
      startProcess(processId);
    }
  }, [processId, process, progress, startProcess]);
  
  const initialNodes = useMemo(() => {
    if (!process) return [];
    return process.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        ...node.data,
        label: node.label,
        nodeType: node.type,
        isCompleted: isStepCompleted(processId, node.id),
        onSelect: () => setSelectedStep(node)
      }
    }));
  }, [process, processId, isStepCompleted]);
  
  const initialEdges = useMemo(() => {
    if (!process) return [];
    return process.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.type === 'loop',
      style: { stroke: '#64748b', strokeWidth: 2 },
      labelStyle: { fill: '#94a3b8', fontSize: 12 },
      labelBgStyle: { fill: '#1e293b' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }
    }));
  }, [process]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  useEffect(() => {
    setNodes(nds => nds.map(node => ({
      ...node,
      data: { ...node.data, isCompleted: isStepCompleted(processId, node.id) }
    })));
  }, [progress, processId, isStepCompleted, setNodes]);
  
  if (!process) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Process Not Found</h1>
          <Link to="/tools/processmap" className="text-blue-400 hover:text-blue-300">
            ← Back to ProcessMap
          </Link>
        </div>
      </div>
    );
  }
  
  const completedCount = progress[processId]?.completedSteps?.length || 0;
  const totalSteps = process.nodes.filter(n => n.type !== 'decision').length;
  const completionPercentage = Math.round((completedCount / totalSteps) * 100);
  
  const handleToggleStep = (stepId) => {
    if (isStepCompleted(processId, stepId)) {
      uncompleteStep(processId, stepId);
    } else {
      completeStep(processId, stepId);
    }
  };
  
  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <button onClick={() => navigate('/tools/processmap')} className="text-slate-400 hover:text-white">
              ← Back
            </button>
            <span className="text-xs px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">
              {process.category}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{process.title}</h1>
              <p className="text-slate-400 text-sm">{process.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {process.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> {process.estimatedCost}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${completionPercentage}%` }} />
                </div>
                <span className="text-sm font-medium text-white">{completionPercentage}%</span>
              </div>
              <button onClick={() => resetProcess(processId)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { mode: 'flowchart', icon: <GitBranch className="w-4 h-4" />, label: 'Flowchart' },
              { mode: 'list', icon: <List className="w-4 h-4" />, label: 'List' },
              { mode: 'checklist', icon: <CheckSquare className="w-4 h-4" />, label: 'Checklist' }
            ].map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                  viewMode === mode 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-slate-400 hover:bg-slate-700'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          
          {process.jurisdictionNote && (
            <div className="mt-4 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{process.jurisdictionNote}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          {viewMode === 'flowchart' ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.3}
              maxZoom={1.5}
            >
              <Background color="#334155" gap={16} />
              <Controls className="bg-slate-800 border-slate-700" />
              <MiniMap 
                nodeColor={(node) => {
                  if (node.data?.isCompleted) return '#22c55e';
                  switch(node.data?.nodeType) {
                    case 'start': return '#22c55e';
                    case 'end': return '#10b981';
                    case 'decision': return '#f59e0b';
                    case 'wait': return '#8b5cf6';
                    case 'document': return '#06b6d4';
                    default: return '#3b82f6';
                  }
                }}
                className="bg-slate-800 border-slate-700"
              />
            </ReactFlow>
          ) : viewMode === 'list' ? (
            <ListView 
              process={process} 
              onSelectStep={setSelectedStep}
              isCompleted={(id) => isStepCompleted(processId, id)}
            />
          ) : (
            <ChecklistView 
              process={process}
              processId={processId}
              onToggle={handleToggleStep}
              isCompleted={(id) => isStepCompleted(processId, id)}
              onSelectStep={setSelectedStep}
            />
          )}
        </div>
        
        {/* Step Detail Panel */}
        <AnimatePresence>
          {selectedStep && (
            <StepDetailPanel
              step={selectedStep}
              processId={processId}
              onClose={() => setSelectedStep(null)}
              onToggle={() => handleToggleStep(selectedStep.id)}
              isCompleted={isStepCompleted(processId, selectedStep.id)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ListView Component
const ListView = ({ process, onSelectStep, isCompleted }) => (
  <div className="p-6 overflow-y-auto h-full">
    <div className="max-w-3xl mx-auto space-y-4">
      {process.nodes.map((node, index) => (
        <button
          key={node.id}
          onClick={() => onSelectStep(node)}
          className={`w-full text-left p-4 rounded-lg border transition-colors ${
            isCompleted(node.id)
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-slate-800 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isCompleted(node.id) ? 'bg-green-500' : 'bg-slate-700'
            }`}>
              {isCompleted(node.id) 
                ? <CheckCircle className="w-5 h-5 text-white" />
                : <span className="text-sm font-medium text-white">{index + 1}</span>
              }
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  node.type === 'start' ? 'bg-green-500/20 text-green-400' :
                  node.type === 'end' ? 'bg-emerald-500/20 text-emerald-400' :
                  node.type === 'decision' ? 'bg-amber-500/20 text-amber-400' :
                  node.type === 'wait' ? 'bg-purple-500/20 text-purple-400' :
                  node.type === 'document' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {node.type}
                </span>
                {node.data?.painPoint && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-300 border border-red-500/30">
                    <AlertTriangle className="w-3 h-3" /> Pain Point
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-white">{node.label}</h3>
              <p className="text-sm text-slate-400 mt-1">{node.data?.description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />
          </div>
        </button>
      ))}
    </div>
  </div>
);

// ChecklistView Component
const ChecklistView = ({ process, processId, onToggle, isCompleted, onSelectStep }) => (
  <div className="p-6 overflow-y-auto h-full">
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Process Checklist</h2>
        <p className="text-slate-400">Check off steps as you complete them</p>
      </div>
      <div className="space-y-2">
        {process.nodes.filter(n => n.type !== 'decision').map(node => (
          <div key={node.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50">
            <button
              onClick={() => onToggle(node.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                isCompleted(node.id) ? 'bg-green-500 border-green-500' : 'border-slate-500'
              }`}
            >
              {isCompleted(node.id) && <CheckCircle className="w-4 h-4 text-white" />}
            </button>
            <button onClick={() => onSelectStep(node)} className={`flex-1 text-left ${isCompleted(node.id) ? 'text-slate-500 line-through' : 'text-white'}`}>
              <div className="font-medium">{node.label}</div>
              {node.data?.timeEstimate && (
                <div className="text-xs text-slate-500">{node.data.timeEstimate}</div>
              )}
            </button>
            {node.data?.painPoint && <AlertTriangle className="w-4 h-4 text-red-400" />}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Step Detail Panel
const StepDetailPanel = ({ step, processId, onClose, onToggle, isCompleted }) => {
  const [expandedSections, setExpandedSections] = useState({ requirements: true, documents: true, tips: true });
  const toggleSection = (section) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-full md:w-96 lg:w-[450px] bg-slate-800 border-l border-slate-700 overflow-y-auto"
    >
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 z-10">
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            step.type === 'start' ? 'bg-green-500/20 text-green-400' :
            step.type === 'end' ? 'bg-emerald-500/20 text-emerald-400' :
            step.type === 'decision' ? 'bg-amber-500/20 text-amber-400' :
            step.type === 'wait' ? 'bg-purple-500/20 text-purple-400' :
            step.type === 'document' ? 'bg-cyan-500/20 text-cyan-400' :
            'bg-blue-500/20 text-blue-400'
          }`}>
            {step.type}
          </span>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">{step.label}</h2>
      </div>
      
      <div className="p-4 space-y-6">
        <p className="text-slate-300">{step.data?.description}</p>
        
        <div className="flex flex-wrap gap-4">
          {step.data?.timeEstimate && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4 text-slate-400" /> {step.data.timeEstimate}
            </div>
          )}
          {step.data?.cost && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <DollarSign className="w-4 h-4 text-slate-400" /> {step.data.cost}
            </div>
          )}
        </div>
        
        {step.data?.painPoint && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
              <AlertTriangle className="w-5 h-5" /> Common Pain Point
            </div>
            <p className="text-sm text-red-200">{step.data.painReason}</p>
          </div>
        )}
        
        {step.data?.requirements?.length > 0 && (
          <CollapsibleSection title="Requirements" icon={<FileText className="w-4 h-4" />} expanded={expandedSections.requirements} onToggle={() => toggleSection('requirements')}>
            <ul className="space-y-2">
              {step.data.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <Circle className="w-2 h-2 mt-1.5 text-slate-500 fill-current" /> {req}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}
        
        {step.data?.documents?.length > 0 && (
          <CollapsibleSection title="Documents Needed" icon={<FileText className="w-4 h-4" />} expanded={expandedSections.documents} onToggle={() => toggleSection('documents')}>
            <ul className="space-y-2">
              {step.data.documents.map((doc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckSquare className="w-4 h-4 text-slate-500" /> {doc}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}
        
        {step.data?.tips?.length > 0 && (
          <CollapsibleSection title="Tips & Advice" icon={<Lightbulb className="w-4 h-4" />} expanded={expandedSections.tips} onToggle={() => toggleSection('tips')}>
            <ul className="space-y-3">
              {step.data.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> {tip}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}
        
        {step.data?.links?.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-white">Helpful Links</h4>
            {step.data.links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                <ExternalLink className="w-4 h-4" /> {link.label}
              </a>
            ))}
          </div>
        )}
        
        {step.data?.nextSteps?.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <h4 className="font-medium text-emerald-400 mb-3">What's Next</h4>
            <ul className="space-y-2">
              {step.data.nextSteps.map((next, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {next}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {step.type !== 'decision' && (
          <button
            onClick={onToggle}
            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isCompleted ? (
              <><CheckCircle className="w-5 h-5" /> Completed - Click to Undo</>
            ) : (
              <><Circle className="w-5 h-5" /> Mark as Complete</>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

const CollapsibleSection = ({ title, icon, expanded, onToggle, children }) => (
  <div className="border border-slate-700 rounded-lg overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center justify-between p-3 hover:bg-slate-700/50">
      <div className="flex items-center gap-2 font-medium text-white">{icon} {title}</div>
      {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
    </button>
    {expanded && <div className="p-3 pt-0 border-t border-slate-700">{children}</div>}
  </div>
);

export default ProcessMapPage;
