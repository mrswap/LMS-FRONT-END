// TextEditor component ko alag file mein nikalo: TextEditor.jsx
import { memo, useEffect, useRef } from "react";

const TextEditor = memo(({ value, onChange, isActive }) => {
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const isFirstRender = useRef(true);
  const isUpdatingFromProps = useRef(false);

  useEffect(() => {
    if (!quillRef.current || quillInstance.current) return;

    // Dynamic import - production build mein safe hai
    const initQuill = async () => {
      const { default: Quill } = await import("quill");
      await import("quill/dist/quill.snow.css");

      const quill = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: "Write your content here...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "clean"],
          ],
        },
      });

      quillInstance.current = quill;

      // Set initial value
      if (value) {
        quill.root.innerHTML = value;
        isFirstRender.current = false;
      }

      // Text change handler
      quill.on("text-change", () => {
        if (isUpdatingFromProps.current) {
          isUpdatingFromProps.current = false;
          return;
        }
        onChange(quill.root.innerHTML);
      });

      // Enable/disable
      if (!isActive) quill.disable();
    };

    initQuill();

    return () => {
      quillInstance.current = null;
    };
  }, []); // Sirf ek baar initialize

  // Value update
  useEffect(() => {
    const quill = quillInstance.current;
    if (!quill || isFirstRender.current) return;

    const currentHTML = quill.root.innerHTML;
    if (value !== currentHTML) {
      isUpdatingFromProps.current = true;
      quill.root.innerHTML = value || "<p><br></p>";
    }
  }, [value]);

  // Enable/disable
  useEffect(() => {
    const quill = quillInstance.current;
    if (!quill) return;
    isActive ? quill.enable() : quill.disable();
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="quill-wrapper" style={{ minHeight: "350px" }}>
      <div ref={quillRef} style={{ height: "350px" }} />
    </div>
  );
});

TextEditor.displayName = "TextEditor";
export default TextEditor;
