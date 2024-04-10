import Button from "./Button";
import { useEffect, useState } from "react";
import "./Notes.css";
import { useFetcher } from "react-router-dom";

export default function Notes({ notes, id, updateUrl }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }

  const fetcher = useFetcher();

  useEffect(()=>{
    fetcher.state === "idle",
    setIsEditing(false)
    
  },[fetcher.state])

  return <fetcher.Form method="POST" action={updateUrl} className="Notes">
    <div className="notesHeader"><h2>Notes</h2>{(notes && !isEditing) && <button onClick={toggleEditing}>edit</button>}</div>
    <div className="notesInner">
      {(!isEditing && notes) && <div className="notes"><pre>{notes}</pre></div>}
      {(!isEditing && !notes) && <div className="noNotes"><Button type="submit" onClick={toggleEditing}>Add notes</Button></div>}
      {isEditing && <><input name="id" type="hidden" value={id} /><textarea name="notes" autoFocus defaultValue={notes} /></>}
    </div>
    {isEditing && <div className="notesControls"><Button onClick={toggleEditing}>cancel</Button><Button type="submit">save</Button></div>}
  </fetcher.Form>
}

