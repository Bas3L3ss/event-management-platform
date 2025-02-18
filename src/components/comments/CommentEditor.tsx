"use client";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface CommentEditorProps {
  editedText: string;
  setEditedText: (value: string) => void;
  isMutating: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const CommentEditor: React.FC<CommentEditorProps> = ({
  editedText,
  setEditedText,
  isMutating,
  onCancel,
  onSave,
}) => {
  return (
    <div className="mt-2">
      <Textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        className="mb-2"
      />
      <div className="flex gap-2">
        <Button
          disabled={isMutating}
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button disabled={isMutating} size="sm" onClick={onSave}>
          {isMutating ? (
            <span className="animate-pulse">...Saving</span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CommentEditor;
