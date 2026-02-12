import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  PlayCircle, CheckCircle, HelpCircle, Clock, FileText, 
  Flag, AlertTriangle 
} from 'lucide-react';

const ProcessNode = memo(({ data, selected }) => {
  const { label, nodeType, isCompleted, onSelect, painPoint, description } = data;
  
  const getNodeStyles = () => {
    const baseStyles = 'process-node px-4 py-3 min-w-[180px] max-w-[220px] cursor-pointer';
    
    let typeStyles = '';
    switch(nodeType) {
      case 'start':
        typeStyles = 'node-start';
        break;
      case 'end':
        typeStyles = 'node-end';
        break;
      case 'decision':
        typeStyles = 'node-decision';
        break;
      case 'wait':
        typeStyles = 'node-wait';
        break;
      case 'document':
        typeStyles = 'node-document';
        break;
      case 'action':
      default:
        typeStyles = 'node-action';
    }
    
    const stateStyles = isCompleted ? 'opacity-70' : '';
    const painStyles = painPoint ? 'node-pain-point' : '';
    const selectedStyles = selected ? 'ring-4 ring-white ring-opacity-30' : '';
    
    return `${baseStyles} ${typeStyles} ${stateStyles} ${painStyles} ${selectedStyles}`;
  };
  
  const getIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    switch(nodeType) {
      case 'start':
        return <PlayCircle className="w-5 h-5" />;
      case 'end':
        return <Flag className="w-5 h-5" />;
      case 'decision':
        return <HelpCircle className="w-5 h-5" />;
      case 'wait':
        return <Clock className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return null;
    }
  };
  
  const showTopHandle = nodeType !== 'start';
  const showBottomHandle = nodeType !== 'end';
  
  return (
    <div className={getNodeStyles()} onClick={onSelect}>
      {/* Handles for connections */}
      {showTopHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-slate-400 !border-none !w-3 !h-3"
        />
      )}
      
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm leading-tight">{label}</div>
          {data.timeEstimate && (
            <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.timeEstimate}
            </div>
          )}
        </div>
        {data.painPoint && (
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
        )}
      </div>
      
      {/* Completion overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-500/10 rounded-lg flex items-center justify-center">
          <div className="absolute top-1 right-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
        </div>
      )}
      
      {showBottomHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-slate-400 !border-none !w-3 !h-3"
        />
      )}
      
      {/* Decision nodes need left/right handles */}
      {nodeType === 'decision' && (
        <>
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            className="!bg-amber-400 !border-none !w-3 !h-3"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="!bg-amber-400 !border-none !w-3 !h-3"
          />
        </>
      )}
    </div>
  );
});

ProcessNode.displayName = 'ProcessNode';

export default ProcessNode;
