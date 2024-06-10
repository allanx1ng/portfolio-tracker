'use client'
export default function({error}) {
    // console.log(error)
    switch (error) {
        case 204:
            return <div>
                No assets found, add one to get started
            </div>
        case 404:
            return <div>
                "No portfolio with the given name found": ""
            </div>
        case 401:
            return <div>
                Please log in
            </div>
        case 403:
            return <div>
                Login expired, log in again
            </div>
        default:
            return <div>unknown error</div>

    }
}