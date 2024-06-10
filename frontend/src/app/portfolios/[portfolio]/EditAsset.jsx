"use client"

export default function ({edit, setEdit}) {
  return (
    <div>
      <button onClick={() => setEdit(!edit)}>Edit assets:</button>
    </div>
  )
}
