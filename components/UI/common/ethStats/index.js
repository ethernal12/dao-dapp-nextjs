export default function Footer() {
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-3">
            <div className="px-4 py-5 sm:px-6">

                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    0.0065 ETH
                </p>
            </div>
            <div className="grid grid-cols-4 mb-5">
                <div className="flex flex-1 items-stretch text-center">
                    <div className="p-10 border drop-shadow rounded-md">
                        <div>
                            <span className="text-2xl font-bold">ETH = 3145.1$</span>
                        </div>
                        <p className="text-xl text-gray-500">Current eth Price</p>
                    </div>
                </div>
                <div className="flex flex-1 items-stretch text-center">
                    <div className="p-10 border drop-shadow rounded-md">
                        <div>
                            <span className="text-2xl font-bold">0.004769 = 15$</span>
                        </div>
                        <p className="text-xl text-gray-500">Price per course</p>
                    </div>
                </div>
            </div>
        </div>

    )



}