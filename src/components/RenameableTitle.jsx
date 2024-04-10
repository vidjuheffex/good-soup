import { useState, useEffect } from "react";
import { useFetcher, Form } from "react-router-dom";
import "./RenameableTitle.css";

export default function RenameableTitle({
  title,
  id,
  renameAction,
  deleteAction,
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    setIsRenaming(false);
  }, [fetcher]);

  const toggleRename = () => {
    setIsRenaming(!isRenaming);
  };

  return (
    <div className={`RenameableTitle ${isRenaming ? "renaming" : ""}`}>
      {isRenaming ? (
        <fetcher.Form
          className="renameForm"
          method="POST"
          action={renameAction}
        >
          <input
            type="text"
            name="name"
            defaultValue={title}
            autoFocus
            required
          />
          <input name="id" type="hidden" value={id} readOnly />
          <button className="cancel" type="button" onClick={toggleRename}>
            cancel
          </button>
          <button type="submit">ok</button>
        </fetcher.Form>
      ) : (
        <h1>{title}</h1>
      )}

      {!isRenaming && (
        <>
          <button className="renameButton" onClick={toggleRename}>
            rename
          </button>

          {deleteAction && (
            <Form
              className="deleteForm"
              method="DELETE"
              action={deleteAction}
              onSubmit={(event) => {
                const userconfirm = confirm(
                  "Are you sure? This cannot be undone.",
                );
                if (!userconfirm) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={id} readOnly />
              <button className="delete">delete</button>
            </Form>
          )}
        </>
      )}
    </div>
  );
}
