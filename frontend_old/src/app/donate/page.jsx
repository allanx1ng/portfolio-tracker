import OpenModalButton from "./OpenModalButton"
import SubmitDonation from "./SubmitDonation"

export default function () {
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              As of right now, AppName is still in development and is not monetized yet. We rely on
              ur donations to continue developing new features
            </p>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <OpenModalButton />
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg mt-4">Select donation amount:</h3>
                {/* <p className="py-4">Select donation amount:</p> */}
                <div className="grid grid-cols-1 justify-items-center gap-0">
                  <div className="grid grid-cols-1 w-full gap-y-4 my-8 justify-items-center items-center">
                    <SubmitDonation price={5} />
                    <SubmitDonation price={10} />
                    <SubmitDonation price={20} />
                    <SubmitDonation price={50} />
                    <SubmitDonation price={100} />
                    <div className="modal-action mt-0">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn w-40">Close</button>
                      </form>
                    </div>
                  </div>
                  {/* <div className="modal-action mt-0">
                    <form method="dialog">
                      <button className="btn">Close</button>
                    </form>
                  </div> */}
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
