// import React, { useState, useEffect, useRef } from 'react';
// import PersonIcon from '@mui/icons-material/Person';
// import ZoomInIcon from '@mui/icons-material/ZoomIn';
// import ZoomOutIcon from '@mui/icons-material/ZoomOut';
// import RestartAltIcon from '@mui/icons-material/RestartAlt';
// import CircularProgress from '@mui/material/CircularProgress';
// import Alert from '@mui/material/Alert';
// import axiosInstance from 'axiosInstance';

// const PersonNode = ({ person, x, y, profileSize = 70, screenSize }) => {
//   // Adjust text and profile sizes based on screen size
//   const circleRadius = profileSize / 2;
//   const textSize = screenSize === 'small' ? 10 : screenSize === 'medium' ? 11 : 12;
//   const iconSize = profileSize / 2;
  
//   return (
//     <g className="person-node">
//       {/* Outer color circle */}
//       <circle
//         cx={x}
//         cy={y}
//         r={circleRadius}
//         fill={person.teamColor || "#6B66FF"}
//       />
      
//       {/* Inner white circle */}
//       <circle
//         cx={x}
//         cy={y}
//         r={circleRadius - 4}
//         fill="white"
//         stroke={person.teamColor || "#6B66FF"}
//         strokeWidth="1"
//       />
      
//       {/* Person icon */}
//       <foreignObject
//         x={x - circleRadius + 15}
//         y={y - circleRadius + 15}
//         width={profileSize - 30}
//         height={profileSize - 30}
//       >
//         <div className="flex items-center justify-center w-full h-full">
//           <PersonIcon style={{ fontSize: iconSize, color: "#3f51b5" }} />
//         </div>
//       </foreignObject>
      
//       {/* Text labels - adjust y offset based on screen size */}
//       <text
//         x={x}
//         y={y + circleRadius + (screenSize === 'small' ? 14 : 18)}
//         textAnchor="middle"
//         fontSize={textSize}
//         fill={person.teamColor || "#6B66FF"}
//         fontWeight="500"
//       >
//         {person.fullName || person.name}
//       </text>
      
//       <text
//         x={x}
//         y={y + circleRadius + (screenSize === 'small' ? 26 : 32)}
//         textAnchor="middle"
//         fontSize={textSize - 1}
//         fill="#666"
//       >
//         {person.position || person.rankName || "Associate"}
//       </text>
      
//       {person.associateCode && (
//         <text
//           x={x}
//           y={y + circleRadius + (screenSize === 'small' ? 38 : 46)}
//           textAnchor="middle"
//           fontSize={textSize - 1}
//           fill={person.teamColor || "#6B66FF"}
//           fontWeight="500"
//         >
//           {person.associateCode}
//         </text>
//       )}
//     </g>
//   );
// };

// const renderTree = (node, level, x, y, totalWidth, nodeSize, levelHeight, screenSize) => {
//   // Calculate subtree width for proper spacing
//   const calculateSubTreeWidth = (n) => {
//     if (!n.children || n.children.length === 0) {
//       return 1;
//     }
//     return n.children.reduce((sum, child) => sum + calculateSubTreeWidth(child), 0);
//   };
  
//   const subtreeWidth = calculateSubTreeWidth(node);
//   const childrenCount = node.children ? node.children.length : 0;
  
//   // First render current node
//   const elements = [
//     <PersonNode 
//       key={node.associateCode || node.id} 
//       person={node} 
//       x={x} 
//       y={y}
//       profileSize={nodeSize}
//       screenSize={screenSize}
//     />
//   ];
  
//   if (childrenCount === 0) return elements;
  
//   // Calculate positions for children
//   const childSpacing = totalWidth / subtreeWidth;
//   const childrenWidth = childSpacing * subtreeWidth;
//   const startX = x - (childrenWidth / 2) + (childSpacing / 2);
  
//   // Draw line down from parent
//   elements.push(
//     <line
//       key={`vline-${node.associateCode || node.id}`}
//       x1={x}
//       y1={y + nodeSize/2}
//       x2={x}
//       y2={y + levelHeight/2}
//       stroke={node.teamColor || "#6B66FF"}
//       strokeWidth="2"
//     />
//   );
  
//   // Draw horizontal line connecting all children
//   if (childrenCount > 1) {
//     const firstChildX = startX;
//     const lastChildX = startX + (childrenCount - 1) * childSpacing;
    
//     elements.push(
//       <line
//         key={`hline-${node.associateCode || node.id}`}
//         x1={firstChildX}
//         y1={y + levelHeight/2}
//         x2={lastChildX}
//         y2={y + levelHeight/2}
//         stroke={node.teamColor || "#6B66FF"}
//         strokeWidth="2"
//       />
//     );
//   }
  
//   // Render each child and connections
//   let currentX = startX;
  
//   node.children.forEach((child) => {
//     // Current child width
//     const childSubtreeWidth = calculateSubTreeWidth(child);
    
//     // Calculate child position
//     const childX = currentX;
//     const childY = y + levelHeight;
    
//     // Add vertical line to this child
//     elements.push(
//       <line
//         key={`cline-${node.associateCode || node.id}-${child.associateCode || child.id}`}
//         x1={childX}
//         y1={y + levelHeight/2}
//         x2={childX}
//         y2={childY - nodeSize/2}
//         stroke={node.teamColor || "#6B66FF"}
//         strokeWidth="2"
//       />
//     );
    
//     // Add child's subtree
//     elements.push(
//       ...renderTree(
//         child,
//         level + 1,
//         childX,
//         childY,
//         childSpacing * childSubtreeWidth,
//         nodeSize * (screenSize === 'small' ? 0.85 : 0.9), // Slightly smaller nodes for lower levels
//         levelHeight * (screenSize === 'small' ? 0.9 : 1),
//         screenSize
//       )
//     );
    
//     // Move to next child position
//     currentX += childSpacing * childSubtreeWidth;
//   });
  
//   return elements;
// };

// // Calculate tree dimensions for proper scaling
// const calculateTreeDimensions = (data) => {
//   if (!data) return { depth: 1, width: 1 };
  
//   let maxDepth = 0;
//   let maxWidth = 0;
  
//   const traverseTree = (node, level) => {
//     if (level > maxDepth) maxDepth = level;
    
//     const levelWidths = {};
//     const countNodesAtLevel = (n, l) => {
//       levelWidths[l] = (levelWidths[l] || 0) + 1;
//       if (n.children && n.children.length > 0) {
//         n.children.forEach(child => countNodesAtLevel(child, l + 1));
//       }
//     };
    
//     countNodesAtLevel(data, 0);
    
//     Object.values(levelWidths).forEach(width => {
//       if (width > maxWidth) maxWidth = width;
//     });
//   };
  
//   traverseTree(data, 0);
  
//   return {
//     depth: maxDepth + 1,
//     width: maxWidth
//   };
// };

// const OrganizationalChart = ({ associateCode }) => {
//   const containerRef = useRef(null);
//   const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
//   const [zoom, setZoom] = useState(1);
//   const [pan, setPan] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [screenSize, setScreenSize] = useState('large');
//   const [hierarchyData, setHierarchyData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Fetch organization hierarchy data from API
//   useEffect(() => {
//     const fetchHierarchyData = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         // Fetch for specific associate if associate code is provided
//         const url = associateCode 
//           ? `/realEstate/associate/getAll-Tree-associate-byAssociateCode?associateCode=${associateCode}`
//           : '/realEstate/associate/getAll';
        
//         const response = await axiosInstance.get(url);
        
//         if (response.data && (response.data.data || response.data.status === 200)) {
//           // Handle different API response structures
//           if (associateCode && response.data.data) {
//             // Direct tree structure from the getAll-Tree-associate API
//             setHierarchyData(response.data.data);
//           } else if (Array.isArray(response.data.data)) {
//             // When we get flat list of associates, find the root associate
//             // This assumes the first associate is the root for demonstration
//             const associates = response.data.data;
            
//             // For testing, construct a simple hierarchy if we have associates
//             if (associates.length > 0) {
//               // Root is the first associate
//               const root = {
//                 ...associates[0],
//                 teamColor: "#8BC34A",
//                 children: []
//               };
              
//               // Rest are child nodes (just for demonstration)
//               for (let i = 1; i < associates.length; i++) {
//                 root.children.push({
//                   ...associates[i],
//                   teamColor: "#42A5F5",
//                   children: []
//                 });
//               }
              
//               setHierarchyData(root);
//             } else {
//               setError("No associates found");
//             }
//           } else {
//             setError("Invalid data format received from API");
//           }
//         } else {
//           setError("No data received from API");
//         }
//       } catch (err) {
//         console.error("Error fetching hierarchy data:", err);
//         setError(`Failed to fetch organization data: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchHierarchyData();
//   }, [associateCode]);
  
//   // Tree dimensions for calculations
//   const treeDimensions = calculateTreeDimensions(hierarchyData);
  
//   // Set base dimensions for the chart
//   const baseWidth = Math.max(1000, treeDimensions.width * 200);
//   const baseHeight = Math.max(600, treeDimensions.depth * 200);
  
//   // Update dimensions and screen size category on window resize
//   useEffect(() => {
//     const updateDimensions = () => {
//       if (!containerRef.current) return;
      
//       const width = containerRef.current.clientWidth;
//       const height = window.innerHeight * 0.8; // Use 80% of viewport height
      
//       // Determine screen size category
//       let size = 'large';
//       if (width < 768) {
//         size = 'small';
//       } else if (width < 1024) {
//         size = 'medium';
//       }
      
//       setScreenSize(size);
//       setDimensions({ width, height });
//     };
    
//     updateDimensions();
//     window.addEventListener('resize', updateDimensions);
//     return () => window.removeEventListener('resize', updateDimensions);
//   }, []);
  
//   // Handle zoom controls
//   const handleZoomIn = () => {
//     setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
//   };
  
//   const handleZoomOut = () => {
//     setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));
//   };
  
//   const handleReset = () => {
//     setZoom(1);
//     setPan({ x: 0, y: 0 });
//   };
  
//   // Handle pan/drag functionality
//   const handleMouseDown = (e) => {
//     if (e.button !== 0) return; // Only left mouse button
//     setIsDragging(true);
//     setDragStart({ x: e.clientX, y: e.clientY });
//   };
  
//   const handleMouseMove = (e) => {
//     if (!isDragging) return;
//     const dx = e.clientX - dragStart.x;
//     const dy = e.clientY - dragStart.y;
//     setPan(prevPan => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
//     setDragStart({ x: e.clientX, y: e.clientY });
//   };
  
//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };
  
//   // Touch events for mobile
//   const handleTouchStart = (e) => {
//     if (e.touches.length !== 1) return;
//     setIsDragging(true);
//     setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
//   };
  
//   const handleTouchMove = (e) => {
//     if (!isDragging || e.touches.length !== 1) return;
//     const dx = e.touches[0].clientX - dragStart.x;
//     const dy = e.touches[0].clientY - dragStart.y;
//     setPan(prevPan => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
//     setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
//   };
  
//   const handleTouchEnd = () => {
//     setIsDragging(false);
//   };
  
//   // Calculate node sizes based on screen size
//   const getNodeSize = () => {
//     switch (screenSize) {
//       case 'small': return 60;
//       case 'medium': return 70;
//       default: return 80;
//     }
//   };
  
//   // Calculate level height based on screen size
//   const getLevelHeight = () => {
//     switch (screenSize) {
//       case 'small': return 150;
//       case 'medium': return 170;
//       default: return 180;
//     }
//   };
  
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center p-8 bg-gray-50 rounded-lg">
//         <CircularProgress />
//         <p className="ml-4 text-gray-600">Loading organization structure...</p>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <Alert severity="error" className="m-4">
//         {error}
//       </Alert>
//     );
//   }
  
//   if (!hierarchyData) {
//     return (
//       <Alert severity="info" className="m-4">
//         No organization data available
//       </Alert>
//     );
//   }
  
//   return (
//     <div 
//       ref={containerRef} 
//       className="w-full bg-gray-50 p-2 sm:p-4 rounded-lg shadow-md"
//     >
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Controls */}
//         <div className="flex justify-end p-2 border-b border-gray-200 bg-gray-50">
//           <div className="flex space-x-2">
//             <button 
//               onClick={handleZoomIn}
//               className="p-1 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
//               aria-label="Zoom in"
//             >
//               <ZoomInIcon style={{ fontSize: 20 }} />
//             </button>
//             <button 
//               onClick={handleZoomOut}
//               className="p-1 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
//               aria-label="Zoom out"
//             >
//               <ZoomOutIcon style={{ fontSize: 20 }} />
//             </button>
//             <button 
//               onClick={handleReset}
//               className="p-1 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
//               aria-label="Reset view"
//             >
//               <RestartAltIcon style={{ fontSize: 20 }} />
//             </button>
//           </div>
//         </div>
        
//         {/* SVG Chart with pan and zoom */}
//         <div 
//           className="overflow-hidden cursor-grab"
//           style={{ height: dimensions.height }}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//         >
//           <svg 
//             width={dimensions.width} 
//             height={dimensions.height}
//             viewBox={`0 0 ${baseWidth} ${baseHeight}`}
//             preserveAspectRatio="xMidYMid meet"
//           >
//             <g transform={`translate(${pan.x + baseWidth/2}, ${pan.y + 80}) scale(${zoom})`}>
//               {renderTree(
//                 hierarchyData,
//                 0,
//                 0, // Center X
//                 0, // Top Y
//                 baseWidth * 0.8, // Available width
//                 getNodeSize(),   // Node size
//                 getLevelHeight(), // Level height
//                 screenSize
//               )}
//             </g>
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationalChart;
//no company

import React, { useState, useEffect, useRef } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import axiosInstance from '../../axiosInstance';

// Person/Associate Node Component
const PersonNode = ({ person, x, y, profileSize = 70, screenSize, isCompany = false }) => {
  // Adjust text and profile sizes based on screen size
  const circleRadius = profileSize / 2;
  const textSize = screenSize === 'small' ? 10 : screenSize === 'medium' ? 11 : 12;
  const iconSize = profileSize / 2;
  
  // Use different colors based on level or type
  const nodeColor = isCompany ? "#8BC34A" : "#42A5F5"; // Green for company, blue for associates
  
  return (
    <g className="person-node">
      {/* Outer color circle */}
      <circle
        cx={x}
        cy={y}
        r={circleRadius}
        fill={nodeColor}
        stroke={nodeColor}
        strokeWidth="2"
      />
      
      {/* Inner white circle */}
      <circle
        cx={x}
        cy={y}
        r={circleRadius - 4}
        fill="white"
        stroke={nodeColor}
        strokeWidth="1"
      />
      
      {/* Person or Company icon */}
      <foreignObject
        x={x - iconSize/2}
        y={y - iconSize/2}
        width={iconSize}
        height={iconSize}
      >
        <div className="flex items-center justify-center w-full h-full">
          {isCompany ? 
            <BusinessIcon style={{ fontSize: iconSize, color: "#8BC34A" }} /> :
            <PersonIcon style={{ fontSize: iconSize, color: "#42A5F5" }} />
          }
        </div>
      </foreignObject>
      
      {/* Text labels - adjust y offset based on screen size */}
      <text
        x={x}
        y={y + circleRadius + 15}
        textAnchor="middle"
        fontSize={textSize}
        fill={nodeColor}
        fontWeight="500"
      >
        {isCompany ? "COMPANY" : (person.fullName || person.name)}
      </text>
      
      <text
        x={x}
        y={y + circleRadius + 30}
        textAnchor="middle"
        fontSize={textSize - 1}
        fill="#666"
      >
        {isCompany ? "Root Node" : (person.position || person.rankName || "Associate")}
      </text>
      
      {!isCompany && person.associateCode && (
        <text
          x={x}
          y={y + circleRadius + 45}
          textAnchor="middle"
          fontSize={textSize - 2}
          fill={nodeColor}
          fontWeight="500"
        >
          {person.associateCode}
        </text>
      )}
    </g>
  );
};

// Calculate the total width needed for a subtree
const calculateSubtreeWidth = (node, nodePadding = 120) => {
  if (!node) return nodePadding;
  if (!node.children || node.children.length === 0) {
    return nodePadding;
  }
  
  const childrenWidth = node.children.reduce((sum, child) => 
    sum + calculateSubtreeWidth(child, nodePadding), 0);
  
  // Return max of node's width or total children width
  return Math.max(nodePadding, childrenWidth);
};


// const renderCompleteTree = (rootNode, width, nodeSize, levelHeight) => {
//     const elements = [];
    
//     // Function to recursively render each node and its children
//     const renderNode = (node, x, y, level, parentX = null, parentY = null) => {
//       if (!node) return 0;
      
//       // Render the node
//       elements.push(
//         <PersonNode
//           key={`node-${node.associateCode || "company"}-${level}-${x}`}
//           person={node}
//           x={x}
//           y={y}
//           profileSize={nodeSize}
//           isCompany={node.isCompany}
//         />
//       );
      
//       // Connect to parent if not root
//       if (parentX !== null && parentY !== null) {
//         elements.push(
//           <line
//             key={`line-to-parent-${node.associateCode || "child"}-${level}-${x}`}
//             x1={x}
//             y1={y - nodeSize/2}
//             x2={parentX}
//             y2={parentY + nodeSize/2}
//             stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//             strokeWidth="2"
//           />
//         );
//       }
      
//       // If no children, we're done with this branch
//       if (!node.children || node.children.length === 0) {
//         return;
//       }
      
//       // Calculate positions for children
//       const childrenCount = node.children.length;
//       const childY = y + levelHeight;
      
//       // Calculate total width needed
//       const totalChildrenWidth = node.children.reduce((acc, child) => 
//         acc + calculateSubtreeWidth(child), 0);
      
//       // Starting X position for the first child
//       let currentX = x - (totalChildrenWidth / 2) + calculateSubtreeWidth(node.children[0]) / 2;
      
//       // Draw vertical line down from parent (if multiple children)
//       if (childrenCount > 1) {
//         const verticalLineBottomY = y + levelHeight/2;
        
//         // Draw line down from parent
//         elements.push(
//           <line
//             key={`line-down-${node.associateCode || "company"}-${level}-${x}`}
//             x1={x}
//             y1={y + nodeSize/2}
//             x2={x}
//             y2={verticalLineBottomY}
//             stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//             strokeWidth="2"
//           />
//         );
        
//         // Calculate horizontal line start/end
//         const firstChildX = currentX;
//         let lastChildX = firstChildX;
        
//         // Pre-calculate the positions to find the last child's X coordinate
//         node.children.forEach((child, i) => {
//           const childWidth = calculateSubtreeWidth(child);
//           if (i === childrenCount - 1) {
//             lastChildX = currentX;
//           }
//           currentX += childWidth;
//         });
        
//         // Draw horizontal line connecting all children
//         elements.push(
//           <line
//             key={`line-across-${node.associateCode || "company"}-${level}-${x}`}
//             x1={firstChildX}
//             y1={verticalLineBottomY}
//             x2={lastChildX}
//             y2={verticalLineBottomY}
//             stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//             strokeWidth="2"
//           />
//         );
        
//         // Reset currentX for actual node rendering
//         currentX = x - (totalChildrenWidth / 2) + calculateSubtreeWidth(node.children[0]) / 2;
//       } else if (childrenCount === 1) {
//         // Direct line to single child
//         elements.push(
//           <line
//             key={`line-direct-${node.associateCode || "company"}-${level}-${x}`}
//             x1={x}
//             y1={y + nodeSize/2}
//             x2={x}
//             y2={childY - nodeSize/2}
//             stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//             strokeWidth="2"
//           />
//         );
//       }
      
//       // Render all children nodes
//       node.children.forEach((child, i) => {
//         const childWidth = calculateSubtreeWidth(child);
//         const childX = currentX;
        
//         // If multiple children, draw vertical line from horizontal connector to child
//         if (childrenCount > 1) {
//           elements.push(
//             <line
//               key={`line-to-child-${child.associateCode || `child-${i}`}-${level+1}`}
//               x1={childX}
//               y1={y + levelHeight/2}
//               x2={childX}
//               y2={childY - nodeSize/2}
//               stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//               strokeWidth="2"
//             />
//           );
//         }
        
//         // Recursively render this child and its children
//         renderNode(child, childX, childY, level + 1, x, y);
        
//         // Move X position for next child
//         currentX += childWidth;
//       });
//     };
    
//     // Start rendering from root node
//     renderNode(rootNode, width / 2, 60, 0);
    
//     return elements;
//   };
  

//final middle
const renderCompleteTree = (rootNode, width, nodeSize, levelHeight) => {
    const elements = [];
    
    const calculateSubtreeWidth = (node, spacing = 150) => {
      if (!node || !node.children || node.children.length === 0) return spacing;
      
      return node.children.reduce((total, child) => 
        total + calculateSubtreeWidth(child, spacing), 0);
    };
  
    const renderNode = (node, x, y, level, parentX = null, parentY = null) => {
      if (!node) return { width: 0, x: x };
      
      // Render the node
      elements.push(
        <PersonNode
          key={`node-${node.associateCode || "company"}-${level}-${x}`}
          person={node}
          x={x}
          y={y}
          profileSize={nodeSize}
          isCompany={node.isCompany}
        />
      );
      
      // Connect to parent with angled lines
      if (parentX !== null && parentY !== null) {
        const midY = (parentY + y) / 2;
        
        elements.push(
          <>
            {/* Vertical line from parent */}
            <line
              key={`line-vertical-parent-${node.associateCode || "child"}-${level}`}
              x1={parentX}
              y1={parentY + nodeSize/2}
              x2={parentX}
              y2={midY}
              stroke="#42A5F5"
              strokeWidth="2"
            />
            
            {/* Horizontal line at middle */}
            <line
              key={`line-horizontal-${node.associateCode || "child"}-${level}`}
              x1={parentX}
              y1={midY}
              x2={x}
              y2={midY}
              stroke="#42A5F5"
              strokeWidth="2"
            />
            
            {/* Vertical line to child */}
            <line
              key={`line-vertical-child-${node.associateCode || "child"}-${level}`}
              x1={x}
              y1={midY}
              x2={x}
              y2={y - nodeSize/2}
              stroke="#42A5F5"
              strokeWidth="2"
            />
          </>
        );
      }
      
      // If no children, return current position
      if (!node.children || node.children.length === 0) {
        return { width: nodeSize, x: x };
      }
      
      // Calculate total width of all children subtrees
      const totalChildrenWidth = node.children.reduce((total, child) => 
        total + calculateSubtreeWidth(child, 150), 0);
      
      // Starting X position for children
      let currentX = x - (totalChildrenWidth / 2);
      const childY = y + levelHeight;
      
      // Store child positions
      node.children.forEach((child) => {
        const childSubtreeWidth = calculateSubtreeWidth(child, 150);
        const childX = currentX + (childSubtreeWidth / 2);
        
        // Recursively render child
        renderNode(child, childX, childY, level + 1, x, y);
        
        // Move X position for next child
        currentX += childSubtreeWidth;
      });
      
      return { 
        width: totalChildrenWidth, 
        x: x 
      };
    };
    
    // Start rendering from root node
    renderNode(rootNode, width / 2, 60, 0);
    
    return elements;
  };

// const renderCompleteTree = (rootNode, width, nodeSize, levelHeight) => {
//     const elements = [];
    
//     const renderNode = (node, x, y, level, parentX = null, parentY = null) => {
//       if (!node) return 0;
      
//       // Render the node
//       elements.push(
//         <g key={`node-${node.associateCode || "root"}-${level}-${x}`}>
//           <rect
//             x={x - 50}
//             y={y - 25}
//             width={100}
//             height={50}
//             fill={level === 0 ? "#90EE90" : level === 1 ? "#F4A460" : "#87CEFA"}
//             stroke="black"
//             strokeWidth="1"
//             rx="5"
//             ry="5"
//           />
//           <text
//             x={x}
//             y={y}
//             textAnchor="middle"
//             alignmentBaseline="middle"
//             fontSize="12"
//             fontWeight="bold"
//             fill="black"
//           >
//             {node.fullName || node.name || "Main Goal"}
//           </text>
//         </g>
//       );
      
//       // Connect to parent if not root
//       if (parentX !== null && parentY !== null) {
//         elements.push(
//           <line
//             key={`line-${node.associateCode || "child"}-${level}`}
//             x1={parentX}
//             y1={parentY + 25}
//             x2={x}
//             y2={y - 25}
//             stroke="black"
//             strokeWidth="1"
//           />
//         );
//       }
      
//       // If no children, we're done with this branch
//       if (!node.children || node.children.length === 0) {
//         return;
//       }
      
//       // Calculate positions for children
//       const childrenCount = node.children.length;
//       const childY = y + levelHeight;
      
//       // Calculate total width needed
//       const totalChildrenWidth = (childrenCount - 1) * 120;
//       const startX = x - totalChildrenWidth / 2;
      
//       // Render children
//       node.children.forEach((child, index) => {
//         const childX = startX + index * 120;
        
//         // Recursively render this child and its children
//         renderNode(child, childX, childY, level + 1, x, y);
//       });
//     };
    
//     // Start rendering from root node
//     renderNode(rootNode, width / 2, 60, 0);
    
//     return elements;
//   };

// Calculate the depth (number of levels) of the tree
const calculateTreeDepth = (node, currentDepth = 0) => {
  if (!node) return 0;
  if (!node.children || node.children.length === 0) return currentDepth;
  
  return Math.max(...node.children.map(child => 
    calculateTreeDepth(child, currentDepth + 1)));
};

// Build hierarchy tree from flat associate list
const buildHierarchyTree = (associates) => {
  if (!associates || associates.length === 0) {
    return null;
  }
  
  // Create a map for quick lookup
  const associateMap = {};
  associates.forEach(associate => {
    associateMap[associate.associateReperCode] = {
      ...associate,
      children: []
    };
  });
  
  // Create company root node
  const rootNode = {
    isCompany: true,
    name: "COMPANY",
    children: []
  };
  
  // Build tree structure
  associates.forEach(associate => {
    const associateNode = associateMap[associate.associateReperCode];
    
    // Skip if this associate has already been processed
    if (!associateNode) return;
    
    if (!associate.refralCodeOfPresentAssociate || associate.refralCodeOfPresentAssociate.trim() === '') {
      // If no referral code, add as direct child of root
      rootNode.children.push(associateNode);
    } else {
      // Find parent associate by referral code
      const parentAssociate = associateMap[associate.refralCodeOfPresentAssociate];
      
      if (parentAssociate) {
        // Add as child of parent associate
        parentAssociate.children.push(associateNode);
      } else {
        // If parent not found, add as direct child of root
        rootNode.children.push(associateNode);
      }
    }
  });
  
  return rootNode;
};

const OrganizationalChart = ({ associateCode }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hierarchyData, setHierarchyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch organization hierarchy data from API
  useEffect(() => {
    const fetchHierarchyData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (associateCode) {
          // Fetch specific associate hierarchy
          const url = `/realEstate/associate/getAll-Tree-associate-byAssociateCode?associateCode=${associateCode}`;
          const response = await axiosInstance.get(url);
          
          if (response.data && response.data.data) {
            setHierarchyData(response.data.data);
          } else {
            setError("No hierarchy data found for this associate code");
          }
        } else {
          // Fetch all associates and build hierarchy
          const response = await axiosInstance.get('/realEstate/associate/getAll');
          
          if (response.data && Array.isArray(response.data.data)) {
            const associates = response.data.data;
            
            if (associates.length > 0) {
              // Build hierarchy tree with company as root node
              const hierarchyTree = buildHierarchyTree(associates);
              setHierarchyData(hierarchyTree);
            } else {
              setError("No associates found");
            }
          } else {
            setError("Invalid data format received from API");
          }
        }
      } catch (err) {
        console.error("Error fetching hierarchy data:", err);
        setError(`Failed to fetch organization data: ${err.message}`);
        
        // For testing - provide dummy data if API fails
        const dummyRoot = {
          isCompany: true,
          name: "COMPANY",
          children: [
            { 
              associateCode: "MOHD3885", 
              fullName: "Mohd Zaid", 
              rankName: "Associate",
              children: [
                { 
                  associateCode: "AKAS7780", 
                  fullName: "Akash Tanwar", 
                  rankName: "Associate",
                  children: [] 
                },
                { 
                  associateCode: "MAMO3983", 
                  fullName: "Mamoon", 
                  rankName: "Associate",
                  children: [
                    { 
                      associateCode: "MOIN5896", 
                      fullName: "Moinuddin Siddiqui", 
                      rankName: "Associate",
                      children: [] 
                    }
                  ] 
                }
              ]
            },
            { 
              associateCode: "HARK6234", 
              fullName: "Harmeet Kaur", 
              rankName: "Associate",
              children: [] 
            },
            { 
              associateCode: "GAUR9562", 
              fullName: "Gaurav Pal", 
              rankName: "Associate",
              children: [] 
            }
          ]
        };
        
        setHierarchyData(dummyRoot);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHierarchyData();
  }, [associateCode]);
  
  // Calculate chart dimensions based on tree structure
  useEffect(() => {
    if (!hierarchyData) return;
    
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      
      // Calculate total width needed for the tree
      const totalWidth = calculateSubtreeWidth(hierarchyData, 150);
      
      // Calculate tree depth
      const treeDepth = calculateTreeDepth(hierarchyData);
      
      // Calculate height based on number of levels
      const estimatedHeight = Math.max(400, 200 + treeDepth * 180);
      
      setDimensions({
        width: Math.max(width, totalWidth),
        height: estimatedHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [hierarchyData]);
  
  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };
  
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  
  // Handle pan/drag functionality
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPan(prevPan => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gray-50 rounded-lg">
        <CircularProgress />
        <p className="ml-4 text-gray-600">Loading organization structure...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" className="m-4">
        {error}
      </Alert>
    );
  }
  
  if (!hierarchyData) {
    return (
      <Alert severity="info" className="m-4">
        No organization data available
      </Alert>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className="w-full bg-gray-50 p-2 sm:p-4 rounded-lg shadow-md"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Controls */}
        <div className="flex justify-between p-2 border-b border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 font-medium pl-2">
            {associateCode ? 
              `Hierarchy for ${associateCode}` : 
              'Full Company Hierarchy'}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleZoomIn}
              className="p-1 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
              aria-label="Zoom in"
            >
              <ZoomInIcon style={{ fontSize: 20 }} />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-1 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
              aria-label="Zoom out"
            >
              <ZoomOutIcon style={{ fontSize: 20 }} />
            </button>
            <button 
              onClick={handleReset}
              className="p-1 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
              aria-label="Reset view"
            >
              <RestartAltIcon style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
        
        {/* Chart content with scrolling */}
        <div 
          className={`overflow-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ 
            height: dimensions.height,
            width: '100%'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div style={{ 
            width: Math.max(dimensions.width * zoom, 800),
            height: Math.max(dimensions.height * zoom, 600),
            position: 'relative'
          }}>
            <svg 
              width="100%" 
              height="100%"
              preserveAspectRatio="xMidYMin meet"
            >
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {renderCompleteTree(
                  hierarchyData,
                  dimensions.width,
                  70, // Node size
                  150  // Level height
                )}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalChart;
//tree like





// import React, { useState, useEffect, useRef } from 'react';
// import PersonIcon from '@mui/icons-material/Person';
// import BusinessIcon from '@mui/icons-material/Business';
// import ZoomInIcon from '@mui/icons-material/ZoomIn';
// import ZoomOutIcon from '@mui/icons-material/ZoomOut';
// import RestartAltIcon from '@mui/icons-material/RestartAlt';
// import CircularProgress from '@mui/material/CircularProgress';
// import Alert from '@mui/material/Alert';
// import axiosInstance from 'axiosInstance';

// // Person/Associate Node Component
// const PersonNode = ({ person, x, y, profileSize = 70, screenSize, isCompany = false }) => {
//   // Adjust text and profile sizes based on screen size
//   const circleRadius = profileSize / 2;
//   const textSize = screenSize === 'small' ? 10 : screenSize === 'medium' ? 11 : 12;
//   const iconSize = profileSize / 2;
  
//   // Use different colors based on level or type
//   const nodeColor = isCompany ? "#8BC34A" : "#42A5F5"; // Green for company, blue for associates
  
//   return (
//     <g className="person-node">
//       {/* Outer color circle */}
//       <circle
//         cx={x}
//         cy={y}
//         r={circleRadius}
//         fill={nodeColor}
//         stroke={nodeColor}
//         strokeWidth="2"
//       />
      
//       {/* Inner white circle */}
//       <circle
//         cx={x}
//         cy={y}
//         r={circleRadius - 4}
//         fill="white"
//         stroke={nodeColor}
//         strokeWidth="1"
//       />
      
//       {/* Person or Company icon */}
//       <foreignObject
//         x={x - iconSize/2}
//         y={y - iconSize/2}
//         width={iconSize}
//         height={iconSize}
//       >
//         <div className="flex items-center justify-center w-full h-full">
//           {isCompany ? 
//             <BusinessIcon style={{ fontSize: iconSize, color: "#8BC34A" }} /> :
//             <PersonIcon style={{ fontSize: iconSize, color: "#42A5F5" }} />
//           }
//         </div>
//       </foreignObject>
      
//       {/* Text labels - adjust y offset based on screen size */}
//       <text
//         x={x}
//         y={y + circleRadius + 15}
//         textAnchor="middle"
//         fontSize={textSize}
//         fill={nodeColor}
//         fontWeight="500"
//       >
//         {isCompany ? "COMPANY" : (person.fullName || person.name)}
//       </text>
      
//       <text
//         x={x}
//         y={y + circleRadius + 30}
//         textAnchor="middle"
//         fontSize={textSize - 1}
//         fill="#666"
//       >
//         {isCompany ? "Root Node" : (person.position || person.rankName || "Associate")}
//       </text>
      
//       {!isCompany && person.associateCode && (
//         <text
//           x={x}
//           y={y + circleRadius + 45}
//           textAnchor="middle"
//           fontSize={textSize - 2}
//           fill={nodeColor}
//           fontWeight="500"
//         >
//           {person.associateCode}
//         </text>
//       )}
//     </g>
//   );
// };

// // Calculate the total width needed for a subtree
// const calculateSubtreeWidth = (node, nodePadding = 120) => {
//   if (!node) return nodePadding;
//   if (!node.children || node.children.length === 0) {
//     return nodePadding;
//   }
  
//   const childrenWidth = node.children.reduce((sum, child) => 
//     sum + calculateSubtreeWidth(child, nodePadding), 0);
  
//   // Return max of node's width or total children width
//   return Math.max(nodePadding, childrenWidth);
// };

// // Render a complete tree with all levels of hierarchy
// const renderCompleteTree = (rootNode, width, nodeSize, levelHeight) => {
//   const elements = [];
  
//   // Function to recursively render each node and its children
//   const renderNode = (node, x, y, level, parentX = null, parentY = null) => {
//     if (!node) return 0;
    
//     // Render the node
//     elements.push(
//       <PersonNode
//         key={`node-${node.associateCode || "company"}-${level}-${x}`}
//         person={node}
//         x={x}
//         y={y}
//         profileSize={nodeSize}
//         isCompany={node.isCompany}
//       />
//     );
    
//     // Connect to parent if not root
//     if (parentX !== null && parentY !== null) {
//       elements.push(
//         <line
//           key={`line-to-parent-${node.associateCode || "child"}-${level}-${x}`}
//           x1={x}
//           y1={y - nodeSize/2}
//           x2={parentX}
//           y2={parentY + nodeSize/2}
//           stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//           strokeWidth="2"
//         />
//       );
//     }
    
//     // If no children, we're done with this branch
//     if (!node.children || node.children.length === 0) {
//       return;
//     }
    
//     // Calculate positions for children
//     const childrenCount = node.children.length;
//     const childY = y + levelHeight;
    
//     // Calculate total width needed
//     const totalChildrenWidth = node.children.reduce((acc, child) => 
//       acc + calculateSubtreeWidth(child), 0);
    
//     // Starting X position for the first child
//     let currentX = x - (totalChildrenWidth / 2) + calculateSubtreeWidth(node.children[0]) / 2;
    
//     // Draw vertical line down from parent (if multiple children)
//     if (childrenCount > 1) {
//       const verticalLineBottomY = y + levelHeight/2;
      
//       // Draw line down from parent
//       elements.push(
//         <line
//           key={`line-down-${node.associateCode || "company"}-${level}-${x}`}
//           x1={x}
//           y1={y + nodeSize/2}
//           x2={x}
//           y2={verticalLineBottomY}
//           stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//           strokeWidth="2"
//         />
//       );
      
//       // Calculate horizontal line start/end
//       const firstChildX = currentX;
//       let lastChildX = firstChildX;
      
//       // Pre-calculate the positions to find the last child's X coordinate
//       node.children.forEach((child, i) => {
//         const childWidth = calculateSubtreeWidth(child);
//         if (i === childrenCount - 1) {
//           lastChildX = currentX;
//         }
//         currentX += childWidth;
//       });
      
//       // Draw horizontal line connecting all children
//       elements.push(
//         <line
//           key={`line-across-${node.associateCode || "company"}-${level}-${x}`}
//           x1={firstChildX}
//           y1={verticalLineBottomY}
//           x2={lastChildX}
//           y2={verticalLineBottomY}
//           stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//           strokeWidth="2"
//         />
//       );
      
//       // Reset currentX for actual node rendering
//       currentX = x - (totalChildrenWidth / 2) + calculateSubtreeWidth(node.children[0]) / 2;
//     } else if (childrenCount === 1) {
//       // Direct line to single child
//       elements.push(
//         <line
//           key={`line-direct-${node.associateCode || "company"}-${level}-${x}`}
//           x1={x}
//           y1={y + nodeSize/2}
//           x2={x}
//           y2={childY - nodeSize/2}
//           stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//           strokeWidth="2"
//         />
//       );
//     }
    
//     // Render all children nodes
//     node.children.forEach((child, i) => {
//       const childWidth = calculateSubtreeWidth(child);
//       const childX = currentX;
      
//       // If multiple children, draw vertical line from horizontal connector to child
//       if (childrenCount > 1) {
//         elements.push(
//           <line
//             key={`line-to-child-${child.associateCode || `child-${i}`}-${level+1}`}
//             x1={childX}
//             y1={y + levelHeight/2}
//             x2={childX}
//             y2={childY - nodeSize/2}
//             stroke={node.isCompany ? "#8BC34A" : "#42A5F5"}
//             strokeWidth="2"
//           />
//         );
//       }
      
//       // Recursively render this child and its children
//       renderNode(child, childX, childY, level + 1, x, y);
      
//       // Move X position for next child
//       currentX += childWidth;
//     });
//   };
  
//   // Start rendering from root node
//   renderNode(rootNode, width / 2, 60, 0);
  
//   return elements;
// };

// // Calculate the depth (number of levels) of the tree
// const calculateTreeDepth = (node, currentDepth = 0) => {
//   if (!node) return 0;
//   if (!node.children || node.children.length === 0) return currentDepth;
  
//   return Math.max(...node.children.map(child => 
//     calculateTreeDepth(child, currentDepth + 1)));
// };

// // Build hierarchy tree from flat associate list
// const buildHierarchyTree = (associates) => {
//   if (!associates || associates.length === 0) {
//     return null;
//   }
  
//   // Create a map for quick lookup
//   const associateMap = {};
//   associates.forEach(associate => {
//     associateMap[associate.associateReperCode] = {
//       ...associate,
//       children: []
//     };
//   });
  
//   // Create company root node
//   const rootNode = {
//     isCompany: true,
//     name: "COMPANY",
//     children: []
//   };
  
//   // Build tree structure
//   associates.forEach(associate => {
//     const associateNode = associateMap[associate.associateReperCode];
    
//     // Skip if this associate has already been processed
//     if (!associateNode) return;
    
//     if (!associate.refralCodeOfPresentAssociate || associate.refralCodeOfPresentAssociate.trim() === '') {
//       // If no referral code, add as direct child of root
//       rootNode.children.push(associateNode);
//     } else {
//       // Find parent associate by referral code
//       const parentAssociate = associateMap[associate.refralCodeOfPresentAssociate];
      
//       if (parentAssociate) {
//         // Add as child of parent associate
//         parentAssociate.children.push(associateNode);
//       } else {
//         // If parent not found, add as direct child of root
//         rootNode.children.push(associateNode);
//       }
//     }
//   });
  
//   return rootNode;
// };

// const OrganizationalChart = ({ associateCode }) => {
//   const containerRef = useRef(null);
//   const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
//   const [zoom, setZoom] = useState(1);
//   const [pan, setPan] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [hierarchyData, setHierarchyData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Fetch organization hierarchy data from API
//   useEffect(() => {
//     const fetchHierarchyData = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         if (associateCode) {
//           // Fetch specific associate hierarchy
//           const url = `/realEstate/associate/getAll-Tree-associate-byAssociateCode?associateCode=${associateCode}`;
//           const response = await axiosInstance.get(url);
          
//           if (response.data && response.data.data) {
//             setHierarchyData(response.data.data);
//           } else {
//             setError("No hierarchy data found for this associate code");
//           }
//         } else {
//           // Fetch all associates and build hierarchy
//           const response = await axiosInstance.get('/realEstate/associate/getAll');
          
//           if (response.data && Array.isArray(response.data.data)) {
//             const associates = response.data.data;
            
//             if (associates.length > 0) {
//               // Build hierarchy tree with company as root node
//               const hierarchyTree = buildHierarchyTree(associates);
//               setHierarchyData(hierarchyTree);
//             } else {
//               setError("No associates found");
//             }
//           } else {
//             setError("Invalid data format received from API");
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching hierarchy data:", err);
//         setError(`Failed to fetch organization data: ${err.message}`);
        
//         // For testing - provide dummy data if API fails
//         const dummyRoot = {
//           isCompany: true,
//           name: "COMPANY",
//           children: [
//             { 
//               associateCode: "MOHD3885", 
//               fullName: "Mohd Zaid", 
//               rankName: "Associate",
//               children: [
//                 { 
//                   associateCode: "AKAS7780", 
//                   fullName: "Akash Tanwar", 
//                   rankName: "Associate",
//                   children: [] 
//                 },
//                 { 
//                   associateCode: "MAMO3983", 
//                   fullName: "Mamoon", 
//                   rankName: "Associate",
//                   children: [
//                     { 
//                       associateCode: "MOIN5896", 
//                       fullName: "Moinuddin Siddiqui", 
//                       rankName: "Associate",
//                       children: [] 
//                     }
//                   ] 
//                 }
//               ]
//             },
//             { 
//               associateCode: "HARK6234", 
//               fullName: "Harmeet Kaur", 
//               rankName: "Associate",
//               children: [] 
//             },
//             { 
//               associateCode: "GAUR9562", 
//               fullName: "Gaurav Pal", 
//               rankName: "Associate",
//               children: [] 
//             }
//           ]
//         };
        
//         setHierarchyData(dummyRoot);
//         setError(null);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchHierarchyData();
//   }, [associateCode]);
  
//   // Calculate chart dimensions based on tree structure
//   useEffect(() => {
//     if (!hierarchyData) return;
    
//     const updateDimensions = () => {
//       if (!containerRef.current) return;
      
//       const width = containerRef.current.clientWidth;
      
//       // Calculate total width needed for the tree
//       const totalWidth = calculateSubtreeWidth(hierarchyData, 150);
      
//       // Calculate tree depth
//       const treeDepth = calculateTreeDepth(hierarchyData);
      
//       // Calculate height based on number of levels
//       const estimatedHeight = Math.max(400, 200 + treeDepth * 180);
      
//       setDimensions({
//         width: Math.max(width, totalWidth),
//         height: estimatedHeight
//       });
//     };
    
//     updateDimensions();
//     window.addEventListener('resize', updateDimensions);
//     return () => window.removeEventListener('resize', updateDimensions);
//   }, [hierarchyData]);
  
//   // Handle zoom controls
//   const handleZoomIn = () => {
//     setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
//   };
  
//   const handleZoomOut = () => {
//     setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));
//   };
  
//   const handleReset = () => {
//     setZoom(1);
//     setPan({ x: 0, y: 0 });
//   };
  
//   // Handle pan/drag functionality
//   const handleMouseDown = (e) => {
//     if (e.button !== 0) return; // Only left mouse button
//     setIsDragging(true);
//     setDragStart({ x: e.clientX, y: e.clientY });
//   };
  
//   const handleMouseMove = (e) => {
//     if (!isDragging) return;
//     const dx = e.clientX - dragStart.x;
//     const dy = e.clientY - dragStart.y;
//     setPan(prevPan => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
//     setDragStart({ x: e.clientX, y: e.clientY });
//   };
  
//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };
  
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center p-8 bg-gray-50 rounded-lg">
//         <CircularProgress />
//         <p className="ml-4 text-gray-600">Loading organization structure...</p>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <Alert severity="error" className="m-4">
//         {error}
//       </Alert>
//     );
//   }
  
//   if (!hierarchyData) {
//     return (
//       <Alert severity="info" className="m-4">
//         No organization data available
//       </Alert>
//     );
//   }
  
//   return (
//     <div 
//       ref={containerRef} 
//       className="w-full bg-gray-50 p-2 sm:p-4 rounded-lg shadow-md"
//     >
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Controls */}
//         <div className="flex justify-between p-2 border-b border-gray-200 bg-gray-50">
//           <div className="text-sm text-gray-600 font-medium pl-2">
//             {associateCode ? 
//               `Hierarchy for ${associateCode}` : 
//               'Full Company Hierarchy'}
//           </div>
//           <div className="flex space-x-2">
//             <button 
//               onClick={handleZoomIn}
//               className="p-1 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
//               aria-label="Zoom in"
//             >
//               <ZoomInIcon style={{ fontSize: 20 }} />
//             </button>
//             <button 
//               onClick={handleZoomOut}
//               className="p-1 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
//               aria-label="Zoom out"
//             >
//               <ZoomOutIcon style={{ fontSize: 20 }} />
//             </button>
//             <button 
//               onClick={handleReset}
//               className="p-1 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100"
//               aria-label="Reset view"
//             >
//               <RestartAltIcon style={{ fontSize: 20 }} />
//             </button>
//           </div>
//         </div>
        
//         {/* Chart content with scrolling */}
//         <div 
//           className={`overflow-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
//           style={{ 
//             height: dimensions.height,
//             width: '100%'
//           }}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//         >
//           <div style={{ 
//             width: Math.max(dimensions.width * zoom, 800),
//             height: Math.max(dimensions.height * zoom, 600),
//             position: 'relative'
//           }}>
//             <svg 
//               width="100%" 
//               height="100%"
//               preserveAspectRatio="xMidYMin meet"
//             >
//               <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
//                 {renderCompleteTree(
//                   hierarchyData,
//                   dimensions.width,
//                   70, // Node size
//                   150  // Level height
//                 )}
//               </g>
//             </svg>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationalChart;
//line wise