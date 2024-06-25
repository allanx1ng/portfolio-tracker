"use client"
export default function () {
  return (
    <button
      className="btn btn-primary"
      onClick={() => document.getElementById("my_modal_1").showModal()}
    >
      Donate Now
    </button>
  )
}
