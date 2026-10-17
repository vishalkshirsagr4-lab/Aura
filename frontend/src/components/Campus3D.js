import { useRef, useEffect } from "react";
import { MousePointerClick as FaHandPointer } from "lucide-react";
import { createCampusScene } from "../scenes3d";

// Real WebGL 3D view of the college photo. Calls onFail() if WebGL or the photo is unavailable.
function Campus3D({ onFail }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const dispose = createCampusScene(canvasRef.current, "/images/campus.jpg", (ok) => {
      if (!ok && onFail) onFail();
    });
    if (!dispose && onFail) onFail();
    return () => {
      if (dispose) dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="campus-3d">
      <canvas ref={canvasRef} aria-label="3D view of the college campus" />
      <span className="drag-hint">
        <FaHandPointer /> Drag to rotate
      </span>
    </div>
  );
}

export default Campus3D;
