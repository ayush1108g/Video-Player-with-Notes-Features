import { Card, Row } from "antd";
import React, { useRef, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const MySunEditor = ({ onChange, initialContent = "" }) => {
  /**
   * @type {React.MutableRefObject<SunEditor>} get type definitions for editor
   */

  const editor = useRef();

  useEffect(() => {
    // Set the initial content when it changes
    if (editor.current && initialContent) {
      editor.current.setContents(initialContent);
    }
  }, [initialContent]);

  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  return (
    <Card className="m-10">
      <Row>
        <SunEditor
          defaultValue={initialContent}
          onChange={onChange}
          setOptions={{
            buttonList: [
              ["font", "fontSize"],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
              ],
              ["align", "horizontalRule", "list", "table"],
              ["fontColor", "hiliteColor"],
              ["outdent", "indent"],
              ["undo", "redo"],
              ["removeFormat"],
              ["outdent", "indent"],
              // ["link", "image"],
              ["preview", "print"],
              ["fullScreen", "showBlocks", "codeView"],
            ],
          }}
          getSunEditorInstance={getSunEditorInstance}
          miHeight="100px"
        />
      </Row>
    </Card>
  );
};
export default MySunEditor;
