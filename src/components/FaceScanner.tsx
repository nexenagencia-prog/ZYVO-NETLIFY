export default function FaceScanner(){
  const lines = ['18,26 42,22 55,34','42,22 72,26 55,34','18,26 24,50 55,34','72,26 78,50 55,34','24,50 37,62 55,34','78,50 68,62 55,34','37,62 55,72 55,34','68,62 55,72 55,34','24,50 37,62 18,72','78,50 68,62 86,72','37,62 55,72 68,62','30,38 55,45 80,38','30,38 24,50 55,45','80,38 78,50 55,45'];
  const pts = [[18,26],[42,22],[72,26],[55,34],[24,50],[78,50],[37,62],[68,62],[55,72],[30,38],[80,38],[55,45],[18,72],[86,72]];
  return <div className="face-scanner" aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <g className="mesh-lines">{lines.map((p,i)=><polyline key={i} points={p} fill="none" />)}</g>
      <g className="mesh-points">{pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3===0?1.05:.75}/>)}</g>
    </svg>
    <span className="scan-line" />
  </div>;
}
