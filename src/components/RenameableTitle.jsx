import { useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import "./RenameableTitle.css";

export default function RenameableTitle({ title, id, action }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    setIsRenaming(false);
  }, [fetcher]);

  const toggleRename = () => {
    setIsRenaming(!isRenaming);
  };

  return (
    <>
      {isRenaming ? (
        <fetcher.Form className="RenameableTitle" method="POST" action={action}>
          <input name="name" defaultValue={title} autoFocus />
          <input name="id" type="hidden" value={id} readOnly />
          <button>ok</button>
        </fetcher.Form>
      ) : (
        <h2>{title}</h2>
      )}

      <button className="renameButton" onClick={toggleRename}>
        {isRenaming ? "Cancel" : "Rename"}
      </button>
    </>
  );
}
